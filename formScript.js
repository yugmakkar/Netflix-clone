const mail = document.getElementById('email').value;
const pass = document.getElementById('pass').value;
const form = document.getElementById('form');
const check = document.getElementById('checkicon');
const checkInp = document.getElementById('checkbox');
const learnMore = document.getElementById('learnmore');
const txt = document.getElementById('addText');
const line = document.getElementById('line');

function validation(){
    if(mail == "" && pass == ""){
        document.getElementById('email').classList.add('border-b-[3px]');
        document.getElementById('email').classList.add('border-[#e38400]');
        document.getElementById('pass').classList.add('border-b-[3px]','border-[#e38400]');
        document.getElementById('emailField').innerHTML = 'Please enter a valid email address or phone number.';
        document.getElementById('passField').innerHTML = 'Your password must contain between 4 and 60 characters.';
        return false;
    }
}

learnMore.addEventListener('click', () => {
    learnMore.classList.add('hidden');
    txt.innerHTML = 'The information collected by Google reCAPTCHA is subject to the Google <span class="text-indigo-500"> Privacy Policy </span> and <span class="text-indigo-500">Terms of Service</span>, and is used for providing, maintaining, and improving the reCAPTCHA service and for general security purposes (it is not used for personalised advertising by Google).';
})