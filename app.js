/**
 * LunaTick - Client Engine
 * Astronomical Moon Calculator & Covert Google Sheets Dispatcher
 */

const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbyJT7DnJl5vF3weap2-shmoSPiRtU_KeWUZpTvgjkN6hfNMRMqcsUgkusrWC_Tyssy49A/exec";

// Secret Astronomical Moon Phase Calculation
// Highly accurate synodic month cycle based on epoch Jan 6, 2000, 18:14 UTC
function calculateSecretLunarPhase(date = new Date()) {
  const epoch = Date.UTC(2000, 0, 6, 18, 14, 0);
  const diffDays = (date.getTime() - epoch) / (1000 * 60 * 60 * 24);
  const synodicMonth = 29.530588853;
  
  let phaseAge = diffDays % synodicMonth;
  if (phaseAge < 0) phaseAge += synodicMonth;

  const theta = (phaseAge / synodicMonth) * 2 * Math.PI;
  const illuminationPct = Math.round(((1 - Math.cos(theta)) / 2) * 100);

  let phaseName = "";
  let phaseEmoji = "";

  if (phaseAge < 1.84566) {
    phaseName = "New Moon";
    phaseEmoji = "🌑";
  } else if (phaseAge < 5.53699) {
    phaseName = "Waxing Crescent";
    phaseEmoji = "🌒";
  } else if (phaseAge < 9.22831) {
    phaseName = "First Quarter";
    phaseEmoji = "🌓";
  } else if (phaseAge < 12.91963) {
    phaseName = "Waxing Gibbous";
    phaseEmoji = "🌔";
  } else if (phaseAge < 16.61096) {
    phaseName = "Full Moon";
    phaseEmoji = "🌕";
  } else if (phaseAge < 20.30228) {
    phaseName = "Waning Gibbous";
    phaseEmoji = "🌖";
  } else if (phaseAge < 23.99361) {
    phaseName = "Last Quarter";
    phaseEmoji = "🌗";
  } else if (phaseAge < 27.68493) {
    phaseName = "Waning Crescent";
    phaseEmoji = "🌘";
  } else {
    phaseName = "New Moon";
    phaseEmoji = "🌑";
  }

  return {
    phaseName,
    phaseEmoji,
    illumination: `${illuminationPct}%`,
    moonAge: `${phaseAge.toFixed(1)} days`
  };
}

// UI Initialization & Form Handling
function initTracker() {
  const trackerForm = document.getElementById("tracker-form");
  const userNameInput = document.getElementById("user-name");
  const submitBtn = document.getElementById("submit-btn");
  const formContainer = document.getElementById("form-container");
  const successContainer = document.getElementById("success-container");
  const resetBtn = document.getElementById("reset-btn");
  const moodCards = document.querySelectorAll(".mood-card");

  function validateForm() {
    const hasName = userNameInput && userNameInput.value.trim().length > 0;
    const selectedRadio = trackerForm ? trackerForm.querySelector('input[name="mood"]:checked') : null;
    if (submitBtn) {
      submitBtn.disabled = !(hasName && selectedRadio);
    }
  }

  // Bind click & keyboard events to all mood cards
  moodCards.forEach((card) => {
    const radio = card.querySelector('input[type="radio"]');

    function selectThisCard() {
      if (radio) radio.checked = true;
      moodCards.forEach((c) => c.classList.remove("selected"));
      card.classList.add("selected");
      validateForm();
    }

    card.addEventListener("click", selectThisCard);

    card.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        selectThisCard();
      }
    });

    if (radio) {
      radio.addEventListener("change", () => {
        moodCards.forEach((c) => c.classList.remove("selected"));
        if (radio.checked) card.classList.add("selected");
        validateForm();
      });
    }
  });

  if (userNameInput) {
    userNameInput.addEventListener("input", validateForm);
  }

  if (trackerForm) {
    trackerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = userNameInput.value.trim();
      const selectedRadio = trackerForm.querySelector('input[name="mood"]:checked');
      if (!name || !selectedRadio) return;

      submitBtn.classList.add("loading");
      submitBtn.disabled = true;

      const now = new Date();
      const lunarData = calculateSecretLunarPhase(now);

      const payload = {
        localTime: now.toLocaleString(),
        isoTimestamp: now.toISOString(),
        moonPhase: lunarData.phaseName,
        illumination: lunarData.illumination,
        moonAge: lunarData.moonAge,
        name: name,
        mood: selectedRadio.value
      };

      try {
        await fetch(GOOGLE_SHEETS_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.error("Submission error:", err);
      }

      setTimeout(() => {
        submitBtn.classList.remove("loading");
        if (formContainer) formContainer.hidden = true;
        if (successContainer) successContainer.hidden = false;
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 400);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (trackerForm) trackerForm.reset();
      moodCards.forEach((c) => c.classList.remove("selected"));
      if (submitBtn) submitBtn.disabled = true;
      if (formContainer) formContainer.hidden = false;
      if (successContainer) successContainer.hidden = true;
      if (userNameInput) userNameInput.focus();
    });
  }

  validateForm();
}

// Support both DOMContentLoaded and immediate execution if script loads deferred
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTracker);
} else {
  initTracker();
}
