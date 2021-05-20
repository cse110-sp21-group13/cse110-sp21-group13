let startButton = document.getElementById('getstarted');
let loginForm = document.getElementById('loginform');

startButton.addEventListener('click', ()=>{
    let welcome = document.getElementById('welcome');
    welcome.style.display = "none";
    loginForm.style.display = "inherit";
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let formData = {
        "username" : document.getElementById('username').value,
        "password" : document.getElementById('password').value
    }
    console.log(formData);
    fetch('../create/session', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        success = response.url.match(/session[^]+/)[0].substring(8);
        if(success == "success") {
            window.location.replace('daily.html');
        }
        else {
            let errorElem = document.getElementById('errormsg');
            errorElem.innerText = "incorrect username or password";
        }
    });
});