/**
 * LunaTick - Client Engine
 * Astronomical Moon Calculator & Covert Google Sheets Dispatcher
 */

const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbyJT7DnJl5vF3weap2-shmoSPiRtU_KeWUZpTvgjkN6hfNMRMqcsUgkusrWC_Tyssy49A/exec";

// Secret Astronomical Moon Phase Calculation
// Synodic month cycle based on epoch Jan 6, 2000, 18:14 UTC
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

function initTracker() {
  const trackerForm = document.getElementById("tracker-form");
  const userNameInput = document.getElementById("user-name");
  const submitBtn = document.getElementById("submit-btn");
  const formContainer = document.getElementById("form-container");
  const successContainer = document.getElementById("success-container");
  const resetBtn = document.getElementById("reset-btn");
  const formError = document.getElementById("form-error");
  const moodCards = document.querySelectorAll(".mood-card");

  let isSubmitting = false;

  function showError(msg) {
    if (!formError) return;
    formError.textContent = msg;
    formError.hidden = false;
  }

  function clearError() {
    if (!formError) return;
    formError.textContent = "";
    formError.hidden = true;
    if (userNameInput) userNameInput.classList.remove("error");
  }

  // Handle card selection
  moodCards.forEach((card) => {
    const radio = card.querySelector('input[type="radio"]');

    function selectCard() {
      if (radio && !radio.checked) {
        radio.checked = true;
      }
      moodCards.forEach((c) => c.classList.remove("selected"));
      card.classList.add("selected");
      clearError();
    }

    card.addEventListener("click", selectCard);

    card.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        selectCard();
      }
    });

    if (radio) {
      radio.addEventListener("change", () => {
        moodCards.forEach((c) => c.classList.remove("selected"));
        if (radio.checked) card.classList.add("selected");
        clearError();
      });
    }
  });

  if (userNameInput) {
    userNameInput.addEventListener("input", clearError);
  }

  // Submit Handler: handled solely on form submit event to avoid duplicate triggers
  function handleFormSubmit(e) {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    const name = userNameInput ? userNameInput.value.trim() : "";
    const selectedRadio = trackerForm ? trackerForm.querySelector('input[name="mood"]:checked') : null;

    if (!name) {
      showError("Please enter your name or nickname to continue.");
      if (userNameInput) {
        userNameInput.classList.add("error");
        userNameInput.focus();
      }
      return;
    }

    if (!selectedRadio) {
      showError("Please select one of the cards above to answer.");
      return;
    }

    clearError();
    isSubmitting = true;

    // Visual button state
    if (submitBtn) {
      submitBtn.disabled = true;
      const textEl = submitBtn.querySelector(".btn-text");
      if (textEl) textEl.textContent = "Recording...";
    }

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

    // Non-blocking background dispatch
    fetch(GOOGLE_SHEETS_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    }).catch((err) => {
      console.warn("Background log sync note:", err);
    });

    // Immediate tactile transition to success screen
    setTimeout(() => {
      if (formContainer) formContainer.hidden = true;
      if (successContainer) successContainer.hidden = false;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 200);
  }

  if (trackerForm) {
    trackerForm.addEventListener("submit", handleFormSubmit);
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (trackerForm) trackerForm.reset();
      moodCards.forEach((c) => c.classList.remove("selected"));
      isSubmitting = false;
      if (submitBtn) {
        submitBtn.disabled = false;
        const textEl = submitBtn.querySelector(".btn-text");
        if (textEl) textEl.textContent = "Submit My Answer";
      }
      clearError();
      if (formContainer) formContainer.hidden = false;
      if (successContainer) successContainer.hidden = true;
      if (userNameInput) userNameInput.focus();
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTracker);
} else {
  initTracker();
}
