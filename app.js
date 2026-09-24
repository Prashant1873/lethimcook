/**
 * LunaTick - Client Engine
 * 
 * Features:
 * - Covert astronomical moon phase calculator
 * - Tactile casual mood card selection
 * - Google Apps Script dispatcher with zero-CORS-friction transport
 */

// 1. Mood Cards Configuration (Casual, relatable terminology)
const MOOD_OPTIONS = [
  {
    id: "on-a-roll",
    title: "On a roll today",
    emoji: "🔥",
    desc: "Sharp, productive, high momentum"
  },
  {
    id: "cruising-chill",
    title: "Cruising / Chill",
    emoji: "🌊",
    desc: "Relaxed, steady, good headspace"
  },
  {
    id: "mood-off",
    title: "Mood off",
    emoji: "🌧️",
    desc: "Down, glum, out of rhythm"
  },
  {
    id: "chaos-mode",
    title: "Chaos mode / Overwhelmed",
    emoji: "🤯",
    desc: "Scattered, 100 tabs open, restless"
  },
  {
    id: "just-existing",
    title: "Just existing / Meh",
    emoji: "😐",
    desc: "Autopilot, neutral, whatever"
  },
  {
    id: "low-battery",
    title: "Low battery / Drained",
    emoji: "🪫",
    desc: "Exhausted, running on empty, need sleep"
  },
  {
    id: "ready-to-snap",
    title: "Ready to snap",
    emoji: "⚡",
    desc: "Irritable, short fuse, agitated"
  },
  {
    id: "in-my-head",
    title: "Deep in my head",
    emoji: "🌀",
    desc: "Overthinking, contemplative, quiet"
  },
  {
    id: "hyped-buzzing",
    title: "Hyped / Buzzing",
    emoji: "✨",
    desc: "Excited, positive anticipation, energetic"
  }
];

// 2. Secret Astronomical Moon Phase Calculation
// Highly accurate synodic month cycle based on epoch Jan 6, 2000, 18:14 UTC
function calculateSecretLunarPhase(date = new Date()) {
  const epoch = Date.UTC(2000, 0, 6, 18, 14, 0);
  const diffDays = (date.getTime() - epoch) / (1000 * 60 * 60 * 24);
  const synodicMonth = 29.530588853;
  
  let phaseAge = diffDays % synodicMonth;
  if (phaseAge < 0) phaseAge += synodicMonth;

  // Illumination fraction (0% to 100%)
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

// 3. Google Sheets Destination (Hardcoded, 100% invisible to respondents)
const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbyJT7DnJl5vF3weap2-shmoSPiRtU_KeWUZpTvgjkN6hfNMRMqcsUgkusrWC_Tyssy49A/exec";

let state = {
  name: "",
  selectedMood: null,
  isSubmitting: false
};

// 4. DOM Elements
const userNameInput = document.getElementById("user-name");
const moodGrid = document.getElementById("mood-grid");
const submitBtn = document.getElementById("submit-btn");
const trackerForm = document.getElementById("tracker-form");
const formContainer = document.getElementById("form-container");
const successContainer = document.getElementById("success-container");
const resetBtn = document.getElementById("reset-btn");

// 5. Initialize Mood Grid Cards
function renderMoodCards() {
  moodGrid.innerHTML = "";
  MOOD_OPTIONS.forEach((mood) => {
    const card = document.createElement("div");
    card.className = "mood-card";
    card.setAttribute("role", "radio");
    card.setAttribute("aria-checked", "false");
    card.setAttribute("tabindex", "0");
    card.dataset.moodId = mood.id;
    card.dataset.moodTitle = mood.title;

    card.innerHTML = `
      <div class="mood-card-header">
        <span class="mood-card-emoji">${mood.emoji}</span>
        <span class="mood-card-check" aria-hidden="true"></span>
      </div>
      <div class="mood-card-title">${mood.title}</div>
      <div class="mood-card-desc">${mood.desc}</div>
    `;

    // Click handler
    card.addEventListener("click", () => selectMood(mood, card));

    // Keyboard accessibility (Space / Enter to select)
    card.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        selectMood(mood, card);
      }
    });

    moodGrid.appendChild(card);
  });
}

function selectMood(mood, cardElement) {
  // Deselect existing
  document.querySelectorAll(".mood-card").forEach(c => {
    c.classList.remove("selected");
    c.setAttribute("aria-checked", "false");
  });

  // Select new
  cardElement.classList.add("selected");
  cardElement.setAttribute("aria-checked", "true");
  state.selectedMood = mood;
  validateForm();
}

function validateForm() {
  const hasName = userNameInput.value.trim().length > 0;
  const hasMood = state.selectedMood !== null;
  submitBtn.disabled = !(hasName && hasMood) || state.isSubmitting;
}

// 6. Form Submission & Secret Lunar Logging
async function handleSubmit() {
  const name = userNameInput.value.trim();
  if (!name || !state.selectedMood || state.isSubmitting) return;

  state.isSubmitting = true;
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
    mood: `${state.selectedMood.emoji} ${state.selectedMood.title}`
  };

  // Dispatch silently to Google Apps Script
  try {
    await fetch(GOOGLE_SHEETS_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error("Submission error:", err);
  }

  // Artificial pleasant delay for tactile confirmation
  setTimeout(() => {
    state.isSubmitting = false;
    submitBtn.classList.remove("loading");
    showSuccessView();
  }, 450);
}

function showSuccessView() {
  formContainer.hidden = true;
  successContainer.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetForm() {
  userNameInput.value = "";
  state.selectedMood = null;
  document.querySelectorAll(".mood-card").forEach(c => {
    c.classList.remove("selected");
    c.setAttribute("aria-checked", "false");
  });
  submitBtn.disabled = true;
  formContainer.hidden = false;
  successContainer.hidden = true;
  userNameInput.focus();
}

// 7. Event Listeners
userNameInput.addEventListener("input", validateForm);
submitBtn.addEventListener("click", handleSubmit);
resetBtn.addEventListener("click", resetForm);

// 8. Initial Boot
renderMoodCards();
validateForm();

