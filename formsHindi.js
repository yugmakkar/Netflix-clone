// Sign-in handling for formsHindi.html (Hindi). Simulated demo auth — stores
// only a session flag + email, never the password. Same logic as formScript.js.

import { signIn } from "./src/store.js";

const hindiText = document.getElementById("addHindiText");
const learnMore = document.getElementById("learnmore");

const prefill = new URLSearchParams(location.search).get("email");
if (prefill) document.getElementById("email").value = prefill;

if (learnMore) {
  learnMore.addEventListener("click", () => {
    learnMore.classList.add("hidden");
    hindiText.innerHTML =
      'Google reCAPTCHA से इकट्ठा की गई जानकारी Google की <span class="text-indigo-500"> प्रायवेसी पॉलिसी </span> और <span class="text-indigo-500">सेवा की शर्तों</span> के अधीन है. इसे reCAPTCHA सेवा देने, उसे बनाए रखने और सुधारने के लिए और सामान्य सुरक्षा उद्देश्य के लिए इस्तेमाल किया जाता है (Google इसका इस्तेमाल करके पर्सनलाईज़ किए गए विज्ञापन नहीं दिखाता).';
  });
}

const emailEl = document.getElementById("email");
const passEl = document.getElementById("pass");

// Demo account autofill (simulated auth).
const demoBtn = document.getElementById("demo-fill");
if (demoBtn) {
  demoBtn.addEventListener("click", () => {
    emailEl.value = "demo@netflix.com";
    passEl.value = "Netflix@123";
    window.validate();
  });
}

function flag(el, fieldId, message) {
  el.classList.add("border-b-[3px]", "border-[#e38400]");
  document.getElementById(fieldId).innerHTML = message;
}
function clearFlag(el, fieldId) {
  el.classList.remove("border-b-[3px]", "border-[#e38400]");
  document.getElementById(fieldId).innerHTML = "";
}

window.validate = function validate() {
  const mail = emailEl.value.trim();
  const pass = passEl.value;
  let ok = true;

  if (!/^\S+@\S+\.\S+$/.test(mail) && !/^\d{7,}$/.test(mail)) {
    flag(emailEl, "emailField", "कृपया सही ईमेल या फ़ोन नंबर डालें.");
    ok = false;
  } else {
    clearFlag(emailEl, "emailField");
  }

  if (pass.length < 4 || pass.length > 60) {
    flag(passEl, "passField", "आपके पासवर्ड में 4 से 60 के बीच कैरेक्टर होने चाहिए.");
    ok = false;
  } else {
    clearFlag(passEl, "passField");
  }

  if (!ok) return false;

  signIn(mail);
  location.assign("profiles.html");
  return false;
};
