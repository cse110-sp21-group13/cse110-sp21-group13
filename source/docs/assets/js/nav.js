const signOut = document.getElementsByTagName('nav')[0].getElementsByTagName('button')[0];

signOut.addEventListener('click', () => {
  fetch('../delete/session', {
    method: 'DELETE',
  })
      .then(response => response.json())
      .then(data => {
          if (data.result == 'Success'){
              window.location.replace('/')
          }
      });
});