let startButton = document.getElementById('getstarted');
let loginForm = document.getElementById('loginform');

startButton.addEventListener('click', ()=>{
    startButton.style.display = "none";
    loginForm.style.display = "initial";
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let formData = {
        "username" : document.getElementById('Name').value,
        "password" : document.getElementById('Password').value
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
        if(success == "success"){
            window.location.replace('daily.html');
        }
    });
});