let username;
fetch('../read/user', {
  method: 'GET',
})
    .then((response) => response.json())
    .then((data) => {
      const greeting = document.getElementById('greeting');
      greeting.innerText = 'Hello ' + data.username + '!';
      username = data.username;
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
  const oldPass = document.getElementById('old').value;
  const newPass = document.getElementById('new').value;
  const passForm = document.getElementsByClassName('changepass')[0];
  if (oldPass == '') {
    const errorMsg = passForm.getElementsByTagName('p')[0];
    errorMsg.innerText = 'incorrect password';
  } else if (newPass == '') {
    const errorMsg = passForm.getElementsByTagName('p')[0];
    errorMsg.innerText = 'please enter a new password';
  } else {
    fetch('../update/user', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        'username': username,
        'updateField': {
          'oldPassword': oldPass,
          'newPassword': newPass,
        },
      }),
    })
        .then((response) => response.text())
        .then((data) => {
          if (data == 'success') {
            const success = document.createElement('h2');
            const child = popWindow.appendChild(success);
            child.innerHTML = 'Password Changed';
            const ok = document.createElement('button');
            popWindow.appendChild(ok).innerText = 'okay';
            passForm.style.display = 'none';

            ok.addEventListener('click', () => {
              popWindow.style.display = 'none';
            });
          } else if (data == 'error: Old password doesn\'t match ' +
            'existing password') {
            const errorMsg = passForm.getElementsByTagName('p')[0];
            errorMsg.innerText = 'incorrect password';
          }
        });
  }
});

const signOut = document.getElementById('signout');

signOut.addEventListener('click', () => {
  fetch('../delete/session', {
    method: 'DELETE',
  })
      .then((response) => response.json())
      .then((data) => {
        if (data.result == 'Success') {
          window.top.location.replace('/');
        }
      });
});

const modeOps = document.getElementsByName('mode');
for (let i = 0; i < modeOps.length; i++) {
  modeOps[i].addEventListener('click', () => {
    fetch('../update/user', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        'username': username,
        'updateField': {
          'style': modeOps[i].value,
        },
      }),
    }).then(() => {
      document.getElementsByTagName('HTML')[0].click();
      window.top.location.reload();
    });
    console.log(modeOps[i].value);
    console.log(username);
  });
}

$.ajax({
  url: '/read/user',
  type: 'GET',
  async: true,
  success: function(retData) {
    const selectedStyle = document.getElementById(retData.style);
    selectedStyle.checked = true;
  },
  error: function() {
    console.log('error');
  },
});

const hamLabel = document.getElementsByClassName('topbar')[0]
    .getElementsByTagName('label')[0];
const settings = document.getElementById('settings');
window.addEventListener('click', (e) => {
  if (e.target.tagName === 'HTML') {
    closePop.click();
    if (settings.checked) {
      settings.click();
    }
    hamLabel.click();
  }
});

const downloadButton = document.getElementById('download-data');
const deleteAccountButton = document.getElementById('delete-account');

downloadButton.addEventListener('click', () => {
  $.ajax({
    url: '/read/user-data',
    type: 'GET',
    async: false,
    success: function(retData) {
      const pom = document.createElement('a');
      pom.setAttribute('href', 'data:text/plain;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(retData)));
      pom.setAttribute('download', 'user-data.json');

      if (document.createEvent) {
        const event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
      } else {
        pom.click();
      }
    },
    error: function() {
      console.log('error');
    },
  });
});

deleteAccountButton.addEventListener('click', () => {
  if (confirm('Are you sure you want to delete your account and all ' +
      'associated data?')) {
    $.ajax({
      url: '/delete/user-data',
      type: 'DELETE',
      async: false,
      success: function(retData) {},
      error: function() {
        console.log('error');
      },
    });

    window.top.location.replace('index.html');
  }
});
