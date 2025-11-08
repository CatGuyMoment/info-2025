const params = new URLSearchParams(window.location.search);
const success = params.get('success'); // Gets the value of the "name" parameter
const infobar = document.getElementById('infobar')

if (success === '0') {
    infobar.style.display = 'flex'
    infobar.textContent = 'An error occured.'
    infobar.style.backgroundColor = 'rgb(255,0,0)'
} else if (success === '1') {
    infobar.style.display = 'flex'
    infobar.textContent = 'Success!'
    infobar.style.backgroundColor = 'rgba(0, 154, 0, 1)'
} 

setTimeout(() => {
    infobar.style.display = 'none'
}, 2000);