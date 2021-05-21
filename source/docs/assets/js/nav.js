const header = document.getElementsByTagName('header')[0];
const navHtml = document.createElement('div');
navHtml.class = 'navbar';
navHtml.innerHTML = 
    `<link rel="stylesheet" href="assets/css/nav.css">
    <div id="topbar">
      <img id="hamburger" src="assets/images/hamburger.svg" alt="three horizonal lines" width="50px">
      <img id="logo" src="assets/images/13bullet_logo.png" alt="a smiling black cat" width="75px">
      <img id="bullet" src="assets/images/13ullet.svg" alt="13Bullet" width="170px"></img>
    </div>
    <nav>
      <a href="daily.html">Daily Log</a>
      <a href="calendar.html">Montly Log</a>
      <button>sign out</button>
    </nav>`;
    
header.appendChild(navHtml);

const hamburger = document.getElementById('hamburger');
const navItems = document.getElementsByTagName('nav')[0];
let vis = false;
hamburger.addEventListener('click', () => {
  if (!vis){
      navItems.style.display = 'block';
      vis = true;
  } else {
      navItems.style.display = 'none';
      vis = false;
  }
});