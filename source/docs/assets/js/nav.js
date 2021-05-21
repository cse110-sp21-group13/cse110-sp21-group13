const header = document.getElementsByTagName('header')[0];
const navHtml = document.createElement('div');
navHtml.class = 'navbar';
navHtml.innerHTML = 
    `<link rel="stylesheet" href="assets/css/nav.css">
    <div class="topbar">
      <label for="hamburger">
        <img src="assets/images/hamburger.svg" alt="three horizonal lines" width="50px">
      </label>
      <img id="barlogo" src="assets/images/13bullet_logo.png" alt="a smiling black cat" width="75px">
      <img id="bartitle" src="assets/images/13ullet.svg" alt="13Bullet" width="170px"></img>
      <h2 id="greeting">Hello!</h2>
    </div>
    <nav>
      <input type="checkbox" id="hamburger"/>
      <div id="hamitems">
        <a href="daily.html">Daily Log ∨</a>
        <a href="calendar.html">Monthly Log ∨</a>
        <button>SIGN OUT</button>
      </div>
    </nav>`;
    
header.appendChild(navHtml);
/*
const greeting = document.getElementById("greeting"){
  
}
*/