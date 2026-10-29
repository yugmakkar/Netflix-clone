// Sign-in handling for forms.html.
// NOTE: this is a simulated demo auth — there is no backend. We store only a
// session flag + the email, NEVER the password. The password field is still
// validated for UX, but its value never leaves this function.

import { signIn } from "./src/store.js";

const learnMore = document.getElementById("learnmore");
const txt = document.getElementById("addText");

// Prefill the email if the landing page passed it through (?email=).
const prefill = new URLSearchParams(location.search).get("email");
if (prefill) document.getElementById("email").value = prefill;

// "Learn more" reCAPTCHA disclaimer toggle (unchanged behavior).
if (learnMore) {
  learnMore.addEventListener("click", () => {
    learnMore.classList.add("hidden");
    txt.innerHTML =
      'The information collected by Google reCAPTCHA is subject to the Google <span class="text-indigo-500"> Privacy Policy </span> and <span class="text-indigo-500">Terms of Service</span>, and is used for providing, maintaining, and improving the reCAPTCHA service and for general security purposes (it is not used for personalised advertising by Google).';
  });
}

const emailEl = document.getElementById("email");
const passEl = document.getElementById("pass");

function flag(el, fieldId, message) {
  el.classList.add("border-b-[3px]", "border-[#e38400]");
  document.getElementById(fieldId).innerHTML = message;
}
function clearFlag(el, fieldId) {
  el.classList.remove("border-b-[3px]", "border-[#e38400]");
  document.getElementById(fieldId).innerHTML = "";
}

// Called by forms.html's onsubmit="return validation()".
window.validation = function validation() {
  const mail = emailEl.value.trim();
  const pass = passEl.value;
  let ok = true;

  // Validate each field independently (the old `&&` missed single-empty cases).
  if (!/^\S+@\S+\.\S+$/.test(mail) && !/^\d{7,}$/.test(mail)) {
    flag(emailEl, "emailField", "Please enter a valid email address or phone number.");
    ok = false;
  } else {
    clearFlag(emailEl, "emailField");
  }

  if (pass.length < 4 || pass.length > 60) {
    flag(passEl, "passField", "Your password must contain between 4 and 60 characters.");
    ok = false;
  } else {
    clearFlag(passEl, "passField");
  }

  if (!ok) return false;

  // Simulated sign-in: persist only the email, then enter the app.
  signIn(mail);
  location.assign("profiles.html");
  return false; // prevent native form submit/navigation
};
