fetch('../read/user', {
    method: 'GET',
})
.then(response => response.json())
.then(data => console.log(data.username));