const selectField = document.getElementById('select-field');
const modal = document.querySelector('.modal-container');
const accordion = document.getElementsByClassName('accordion');
const accordDetails = document.getElementsByClassName('details');
const plus = document.getElementsByClassName('add');
const closee = document.getElementsByClassName('close');
const signs = document.getElementsByClassName('sign');
const container = document.getElementsByClassName('accord-container');
const horizantal = document.getElementsByClassName('line');



selectField.addEventListener('click', () => {
    modal.classList.toggle('hidden');
})

// "Get Started" (and the email box) carry the typed email into the sign-up
// flow, prefilling forms.html instead of jumping to the real netflix.com.
document.querySelectorAll('.get-started-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('.signup-email')?.value.trim() || '';
        const target = form.getAttribute('action') || 'forms.html';
        const qs = email ? `?email=${encodeURIComponent(email)}` : '';
        window.location.assign(`${target}${qs}`);
    });
});

for(let i = 0; i < accordion.length; i++){
    closee[i].classList.add('hidden');
    accordion[i].addEventListener('click', () => {
        let active = accordDetails[i].classList.toggle('hidden');
        if(!active){
            closee[i].classList.remove('hidden');
            plus[i].classList.add('hidden');
            accordion[i].style.backgroundColor = '#333131';
            horizantal[i].classList.remove('hidden');
            
        }else{
            closee[i].classList.add('hidden');
            plus[i].classList.remove('hidden');
            accordion[i].style.backgroundColor = '#242323';
            horizantal[i].classList.add('hidden');
        }
    })
}
