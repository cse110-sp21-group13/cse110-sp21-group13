fetch('../read/user', {
  method: 'GET',
})
    .then((response) => response.json())
    .then(data => {
        const greeting = document.getElementById('greeting');
        greeting.innerText = 'Hello ' + data.username + '!';
    });

const openPop = document.getElementById('openpop');
const popUp = document.getElementsByClassName('changepass')[0];
openPop.addEventListener('click', () => {
  popUp.style.display = 'block';
});

const closePop = document.getElementById('closepop');
closePop.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('old').value = '';
  document.getElementById('new').value = '';
  popUp.style.display = 'none';
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
            .then((response) => console.log(response));
      });
});
