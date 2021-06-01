const masterColorStyleSheet = document.getElementById('master-color');
let userData;

$.ajax({
  url: '/read/user',
  type: 'GET',
  async: false,
  success: function(retData) {
    userData = retData;
  },
  error: function() {
    console.log('error');
  },
});

if (userData.style === undefined) {
  window.location.replace('index.html');
}

masterColorStyleSheet.href = 'assets/css/' + userData.style + '-style.css';
