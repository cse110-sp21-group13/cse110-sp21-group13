var myNodelist = document.getElementsByTagName("LI");
var bulletType = document.getElementById("bullet-type");
let dailyId;


// Create a new date, but destroy all non-date data by slicing ISO and
// inserting 0's.
let truncatedDate = new Date().toISOString().slice(0,10)+'T00:00:00+00:00';

var i;
for (i = 0; i < myNodelist.length; i++) {
  let bulletTypeSpan = document.createElement("bulletTypeSpan");
  let bulletTypeTxt = document.createTextNode(bulletType.value + " ");
  bulletTypeSpan.className = "bullet-Type";
  bulletTypeSpan.appendChild(bulletTypeTxt);
  myNodelist[i].prepend(bulletTypeSpan);
}

var signifier = document.getElementById("signifier");
var x;
for (x = 0; x < myNodelist.length; x++) {
  let signifierSpan = document.createElement("signifierSpan");
  let signifierTxt = document.createTextNode(signifier.value + " ");
  signifierSpan.className = "signifier";
  if (signifier != "") {
    signifierSpan.appendChild(signifierTxt);
    myNodelist[x].prepend(signifierSpan);
  } else {
    signifierSpan.appendChild(signifierTxt);
    myNodelist[x].prepend(signifierSpan);
  }
}

// Date Title
var month_name = function(dt){
    mlist = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
      return mlist[dt];
    };

n =  new Date();
n.toLocaleString('default', { month: 'short' })
y = n.getFullYear();
m = n.getMonth();
d = n.getDate();
document.getElementById("date").innerHTML = month_name(m) + " " + d + ", " + y;

// Click on a close button to hide the current list item
// var close = document.getElementsByClassName("close");
// var i;
// for (i = 0; i < close.length; i++) {
//   close[i].onclick = function() {
//     var div = this.parentElement;
//     div.style.display = "none";
//   }
// }

// Add a "checked" symbol when clicking on a list item
var list = document.querySelector('ul');
list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');
  }
}, false);

async function loadCurrentDay(){

  let dailyGetDoc = {date: truncatedDate};
  // Attempt to get a potential existing daily from the truncated date
  // generated.
  $.ajax({
    url: "/read/daily",
    type: "GET",
    contentType: "application/json",
    data: JSON.stringify(dailyGetDoc),
    success: function(getData){
      // Upon error, it is assumed there is no daily matching the date.
      // Therefore, we must create the daily corresponding to the current date.
      if(getData == "error"){
        let dailyPostDoc = {
              date: truncatedDate,
              monthKey: n.toLocaleString('default', { month: 'short' }),
              bullets: []
        }
        // Create a new daily using the above document's information, and
        // store the new document's ID in the dailyId variable to pass to
        // bullets during creation.
        $.ajax({
          url: "/create/daily",
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify(dailyPostDoc),
          success: function(postData){
            if(postData == "error"){
              console.log("Creation of new daily failed.")
            }
            else{
              dailyId = postData.id; 
            }
          },
          error: function(xhr, status, error){
            console.log(status + " " + error);
          }
        })
      }
      // If the daily log exists, we must load the entries from the json body.
      // We must also store the existing document's id to pass to bullets
      // during creation.
      else{
        dailyId = getData._id;
        getData.bullets.forEach((bullet) =>{
          appendBullet(bullet.content, bullet.bulletType, bullet.signifier);
        });

      }
    },
    error: function(xhr, status, error){
      console.log(status + " " + error);
    }
  })

}

loadCurrentDay();

function appendBullet(inputValue, bulletType, signifier){
  var li = document.createElement("li");
  var t = document.createTextNode(inputValue);
  li.appendChild(t);
  if (inputValue === '') {
    alert("You must write something!");
  } else {
    document.getElementById("myUL").appendChild(li);
  }
  document.getElementById("myInput").value = "";

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
}

// Create a bullet from the given inputs
function createBullet(inputValue, bulletType, signifier){
  let bulletPostDoc = {
    parentDocId: dailyId,
    signifier: signifier,
    bulletType: bulletType,
    content: inputValue,
    date: truncatedDate
  }
  $.ajax({
    url: "/create/bullet",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(bulletPostDoc),
    success: function(postData){
      if(postData == "error"){
        console.log("Creation of new bullet failed.");
        return;
      }
    },
    error: function(xhr, status, error){
      console.log(status + " " + error);
    }
  })
}

// Create a new list item when clicking on the "Add" button
function newBulletFromInputBox() {
  // Select all the values from the bullet input
  var inputValue = document.getElementById("myInput").value;
  var bulletType = document.getElementById("bullet-type").value;
  var signifier = document.getElementById("signifier").value;
  createBullet(inputValue, bulletType, signifier);
  appendBullet(inputValue, bulletType, signifier);
}



// Edit daily log when pressed
function editDaily() {
    let button = document.getElementsByClassName("editBtn")[0].textContent;
    if (button == "Save") {
        document.getElementsByClassName("editBtn")[0].textContent = "Edit";
        document.getElementById("bullet-type").hidden = true;
        document.getElementById("signifier").hidden = true;
        document.getElementById("myInput").hidden = true;
        document.getElementsByClassName("addBtn")[0].hidden = true;
    } else {
        document.getElementsByClassName("editBtn")[0].textContent = "Save";
        document.getElementById("bullet-type").hidden = false;
        document.getElementById("signifier").hidden = false;
        document.getElementById("myInput").hidden = false;
        document.getElementsByClassName("addBtn")[0].hidden = false;
    }
}