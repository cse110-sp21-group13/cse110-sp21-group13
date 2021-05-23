fetch('../read/user', {
  method: 'GET',
})
    .then((response) => response.json())
    .then(data => {
        const greeting = document.getElementById('greeting');
        greeting.innerText = 'Hello ' + data.username + '!';
    })