var myNodelist = document.getElementsByTagName("LI");
var bulletType = document.getElementById("bullet-type");
let queryString = window.location.search
if(queryString == ""){
  let n = new Date();
  console.log(n.getDay());
  queryString = "date="+ n.getFullYear() + "-" + (n.getMonth() + 1) + "-" + (n.getDate());
  window.location.search = queryString;
}
let params = new URLSearchParams(queryString);
let dailyId;

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


// Add a "checked" symbol when clicking on a list item
var list = document.querySelector('ul');
list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');
  }
  let checkStatus = ev.target.className;
  if(checkStatus == "checked"){
    checkStatus = "true";
  }
  else{
    checkStatus = "false";
  }
  let bulletUpdateDoc = {
    _id: ev.target.id,
    updateField: {completed: checkStatus}
  }
  $.ajax({
    url: "/update/bullet",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(bulletUpdateDoc),
    success: function(postData){
      if(postData == "error"){
        console.log("Toggle of completion failed.");
        return;
      }
    },
    error: function(xhr, status, error){
      console.log(status + " " + error);
    }
  })
}, false);

async function loadCurrentDay(){
  // Date components
  let splitDateArray = params.get("date").split("-");
  let monthComponent = splitDateArray[0]+"-"+splitDateArray[1];
  let dayComponent = splitDateArray[2];
  
  // Attempt to get a potential existing daily from the truncated date
  // generated.
  $.ajax({
    url: "/read/daily/"+monthComponent+"/"+dayComponent,
    type: "GET",
    contentType: "application/json",
    success: function(getData){
      // Upon error, it is assumed there is no daily matching the date.
      // Therefore, we must create the daily corresponding to the current date.
      if(getData == "error"){
        let dailyPostDoc = {
              day: dayComponent,
              month: monthComponent,
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
          appendBullet(bullet._id, bullet.content, bullet.bulletType, bullet.signifier, bullet.completed);
        });

      }
    },
    error: function(xhr, status, error){
      console.log(status + " " + error);
    }
  })

}

loadCurrentDay();

function appendBullet(bulletId, inputValue, bulletType, signifier, completed){
  var li = document.createElement("li");
  var t = document.createTextNode(inputValue);
  li.id = bulletId;
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
  // Add a checkmark to completed bullets
  if(completed == "true"){
    li.classList.toggle('checked');
  }
}

// Create a bullet from the given inputs
function createBullet(inputValue, bulletType, signifier){
  let bulletPostDoc = {
    parentDocId: dailyId,
    signifier: signifier,
    bulletType: bulletType,
    content: inputValue,
    completed: "false",
    date:  document.location.search.substring(1),
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
      // Bullet has been created, so add it to the list
      appendBullet(postData.id, inputValue, bulletType, signifier, "false");
    },
    error: function(xhr, status, error){
      console.log(status + " " + error);
      return;
    }
  })

}

// Create a new list item when clicking on the "Add" button
async function newBulletFromInputBox() {
  // Select all the values from the bullet input
  var inputValue = document.getElementById("myInput").value;
  var bulletType = document.getElementById("bullet-type").value;
  var signifier = document.getElementById("signifier").value;
  // Send a request to the database to create a new bullet
  createBullet(inputValue, bulletType, signifier);
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