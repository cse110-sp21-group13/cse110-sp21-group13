// date components
let n = new Date();
let yearMonth = n.getFullYear() + "-" + (n.getMonth() + 1);
let todayDate = n.getDate();
let yesterdayDate = todayDate - 1;

async function loadPrevDay(){
  return loadDailyBullets("prevUL", yearMonth, yesterdayDate);
}

async function loadCurrentDay(){
  return loadDailyBullets("currUL", yearMonth, todayDate);
}
  
async function loadDailyBullets(list, monthComponent, dayComponent) {
  let retData;
  // Attempt to get a potential existing daily from the truncated date
  // generated.
  $.ajax({
    url: "/read/daily/"+monthComponent+"/"+dayComponent,
    type: "GET",
    contentType: "application/json",
    success: function(getData){
      // If the daily log exists, we must load the entries from the json body.
      // We must also store the existing document's id to pass to bullets
      // during creation.
        dailyId = getData._id;
        getData.bullets.forEach((bullet) =>{
          appendBullet(bullet._id, bullet.content, bullet.bulletType, bullet.signifier, bullet.completed, list);
        retData = dailyId;
      });
    },
    error: function(xhr, status, error){
      console.log(status + " " + error);
    }
  })
  return retData;
}

// loads bullets from daily's into lists
loadPrevDay();
loadCurrentDay();

function appendBullet(bulletId, inputValue, bulletType, signifier, completed, list){
    var li = document.createElement("li");
    var t = document.createTextNode(inputValue);
    li.id = bulletId;
    li.appendChild(t);
    if (inputValue === '') {
      alert("You must write something!");
    } else {
      document.getElementById(list).appendChild(li);
    }
  
    var bulletTypeSpan = document.createElement("bulletTypeSpan");
    var bulletTypeTxt = document.createTextNode(bulletType + " ");
    bulletTypeSpan.className = "bulletTypeSpan";
    bulletTypeSpan.appendChild(bulletTypeTxt);
    li.prepend(bulletTypeSpan);
  
    let signifierSpan = document.createElement("signifierSpan");
    let signifierTxt = document.createTextNode(signifier + " ");
    signifierSpan.className = "signifier";
    if (signifier != "") {
      signifierSpan.appendChild(signifierTxt);
      li.prepend(signifierSpan);
    } else {
      signifierSpan.appendChild(signifierTxt);
      li.prepend(signifierSpan);
    }
    // Add a checkmark to completed bullets
    if(completed == "true"){
      li.classList.toggle('checked');
    }
  }

// Migrate item when clicked
var list = document.getElementById('prevUL');
list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    migrate(ev.target.id, 0);
  }
}, false);

function migrate(id, newParent) {
  // delete bullet from previous daily
  fetch('../delete/bullet', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({_id: id}),
  }).then(resp => console.log(resp));

  // create identical bullet in current daily

}

