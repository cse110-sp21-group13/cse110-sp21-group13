const startButton = document.getElementById('getstarted');
const loginForm = document.getElementById('loginform');

startButton.addEventListener('click', ()=>{
  const welcome = document.getElementById('welcome');
  welcome.style.display = 'none';
  loginForm.style.display = 'inherit';
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = {
    'username': document.getElementById('username').value,
    'password': document.getElementById('password').value,
  };
  fetch('../create/session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
      .then((response) => response.json())
      .then((data) => {
        if (data.error == undefined) {
          window.location.replace('daily.html');
        } else if (data.error == 'Incorrect credentials') {
          const errorElem = document.getElementById('errormsg');
          errorElem.innerText = 'incorrect username or password';
        } else {
          const errorElem = document.getElementById('errormsg');
          errorElem.innerText = 'error occured. please try again later.';
        }
      });
});

const signup = document.getElementById('signup');
signup.addEventListener('click', (e) => {
  e.preventDefault();
  const formData = {
    'username': document.getElementById('username').value,
    'password': document.getElementById('password').value,
  };
  fetch('../create/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
      .then((response) => response.json())
      .then((data) => {
        if (data.error == undefined){
          fetch('../create/session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          })
              .then((response) => response.json())
              .then((data) => {
                if (data.error == undefined) {
                  window.location.replace('daily.html');
                }
              });
        } else if (data.error == 'MISSING FIELD') {
          const errorElem = document.getElementById('errormsg');
          errorElem.innerText = 'please enter a username and a password';
        } else {
          const errorElem = document.getElementById('errormsg');
          errorElem.innerText = 'error occured. please try again later.';
        }
        /* TODO: Implement error catching for user already created */
      });
});
