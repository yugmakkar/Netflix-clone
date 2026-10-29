const hindiText = document.getElementById('addHindiText');
const learnMore = document.getElementById('learnmore');
const lineTwo = document.getElementById('line');
const mailInp = document.getElementById('email').value;
const passInp = document.getElementById('pass').value;
const formField = document.getElementById('form');

learnMore.addEventListener('click', () => {
    learnMore.classList.add('hidden');
    hindiText.innerHTML = 'Google reCAPTCHA से इकट्ठा की गई जानकारी Google की <span class="text-indigo-500">  प्रायवेसी पॉलिसी </span> औरd <span class="text-indigo-500">सेवा की शर्तों</span> के अधीन है. इसे reCAPTCHA सेवा देने, उसे बनाए रखने और सुधारने के लिए और सामान्य सुरक्षा उद्देश्य के लिए इस्तेमाल किया जाता है (Google इसका इस्तेमाल करके पर्सनलाईज़ किए गए विज्ञापन नहीं दिखाता).';
})

function validate(){
    if(mailInp == "" && passInp == ""){
        document.getElementById('email').classList.add('border-b-[3px]');
        document.getElementById('email').classList.add('border-[#e38400]');
        document.getElementById('pass').classList.add('border-b-[3px]','border-[#e38400]');
        document.getElementById('emailField').innerHTML = 'कृपया सही ईमेल या फ़ोन नंबर डालें.';
        document.getElementById('passField').innerHTML = 'आपके पासवर्ड में 4 से 60 के बीच कैरेक्टर होने चाहिए.';
        return false;
    }
}