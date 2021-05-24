/*fetch('../create/session', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({'username':'user1', 'password':'password1'}),
});*/

fetch('../read/user', {
  method: 'GET',
})
    .then((response) => response.json())
    .then(data => {
        const greeting = document.getElementById('greeting');
        greeting.innerText = 'Hello ' + data.username + '!';
    });

const openPop = document.getElementById('openpop');
const popWindow = document.getElementsByClassName('popup')[0];
openPop.addEventListener('click', () => {
  popWindow.style.display = 'block';
});

const closePop = document.getElementById('closepop');
closePop.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('old').value = '';
  document.getElementById('new').value = '';
  popWindow.style.display = 'none';
});

const submitPass = document.getElementById('subpass');
submitPass.addEventListener('click', (e) => {
  e.preventDefault();
  const newPass = document.getElementById('new').value;
  fetch('../read/user', {
    method: 'GET',
  })
      .then((response) => response.json())
      .then(data => {

        messageBody = {
          'username': data.username,
          'updateField': {
            'password': newPass,
          },
        }

        fetch('../update/user', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify(messageBody),
        })
            .then((response) => response.text())
            .then((data) => {
              if (data == 'success') {
                const success = document.createElement('h2');
                const child = popWindow.appendChild(success);
                child.innerHTML = 'Password Changed';
                const ok = document.createElement('button');
                popWindow.appendChild(ok).innerText = 'okay';
                const passForm = document.getElementsByClassName('changepass')[0];
                passForm.style.display = 'none';

                ok.addEventListener('click', () => {
                  popWindow.style.display = 'none'
                });
              }
            });
      });
});
