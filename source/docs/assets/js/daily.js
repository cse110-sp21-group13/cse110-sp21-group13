var myNodelist = document.getElementsByTagName("LI");
var bulletType = document.getElementById("bullet-type");
let queryString = window.location.search
if(queryString == ""){
  let n = new Date();
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
n = new Date(params.get("date"));
n.toLocaleString('default', { month: 'short' })
y = n.getFullYear();
m = n.getMonth();
d = n.getDate();
document.getElementById("date").innerHTML = month_name(m) + " " + d + ", " + y;


// Add a "checked" symbol when clicking on a list item
var list = document.querySelectorAll('ul');
list.forEach((listElement) => {
  listElement.addEventListener('click', function(ev) {
    if (ev.target.tagName === 'LI') {
      ev.target.classList.toggle('checked');
    }
    let checkStatus = ev.target.className;

    // Format the checked status for update document creation
    if(checkStatus == "checked"){
      checkStatus = "true";
    }
    else{
      checkStatus = "false";
    }
    // Create the update document to be sent to the backend
    let bulletUpdateDoc = {
      _id: ev.target.id,
      updateField: {completed: checkStatus}
    }
    // Update the completed field in the bullet on the backend
    $.ajax({
      url: "/update/bullet",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(bulletUpdateDoc),
      success: function(postData){
        if(postData == "error"){
          return;
        }
      },
      error: function(xhr, status, error){
        console.log(status + " " + error);
      }
    })
  }, false)
});

// Change the URL parameter to the next day, which forces a reload to the next day
function nextView(){
  d = new Date(params.get("date"));
  d.setDate(d.getDate() + 1);
  window.location.search = "date="+ d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + (d.getDate());
}

// Change the URL parameter to the previous day, which forces a reload to the previous day
function previousView(){
  d = new Date(params.get("date"));
  d.setDate(d.getDate() - 1);
  window.location.search = "date="+ d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + (d.getDate());
}

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
              console.log("Creation of new daily failed.");
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
          if(!bullet._id){
            return;
          }
          if(bullet.parentBulId != "None"){
            appendBullet(bullet.parentBulId, bullet.content, bullet.bulletType, bullet.signifier, bullet.completed, bullet._id);
          }else{
            appendBullet(bullet._id, bullet.content, bullet.bulletType, bullet.signifier, bullet.completed);
          }
          
        });

      }
    },
    error: function(xhr, status, error){
      console.log(status + " " + error);
    }
  })

}

loadCurrentDay();

function appendBullet(bulletId, inputValue, bulletType, signifier, completed, childId = "None"){
  let li = document.createElement("li");
  let t = document.createTextNode(inputValue);
  li.id = bulletId;
  li.appendChild(t);

  // Ensure empty bullets cannot be added
  if (inputValue === '') {
    alert("You must write something!");
    return;
  } 
  // Append button to parents and add list element to parent id
  if(childId != "None"){
    let parentBullet = document.getElementById(bulletId);
    let ul = parentBullet.getElementsByTagName('ul');
    li.id = childId;
    if(ul.length == 0){
        ul = parentBullet.appendChild(document.createElement("ul"));
        ul.appendChild(li);
    }
    else{
      ul[0].appendChild(li);
    }



  }
  // If there is no child parameter
  else {
    document.getElementById("myInput").value = "";
    let button = document.createElement("button");
    button.innerHTML = "+";
    button.hidden = true;
    button.className = "sub-bullet-button"
    button.addEventListener('click', () =>{
        let subContainer = document.getElementById("sub-bullet-container");
        if(subContainer.hidden){
          subContainer.hidden = false;
        }else{
          subContainer.hidden = true;
        }

        li.appendChild(subContainer);
    });

    li.appendChild(button);
    li.addEventListener("mouseover", () => {
      button.hidden = false;
    })
    li.addEventListener("mouseout", () => {
      button.hidden = true;
    })

    // Add bullets to category based on their signifier
    if(signifier == " "){
      document.getElementById("Bullets").appendChild(li);
      document.getElementById("bulletTitle").hidden = false;
    }
    else if(signifier == "*"){
      document.getElementById("Priority").appendChild(li);
      document.getElementById("priorityTitle").hidden = false;
    }
    else if (signifier == "!"){
      document.getElementById("Inspiration").appendChild(li);
      document.getElementById("inspirationTitle").hidden = false;
    }

  }

  // Change the bullet list style to the necessary type of bullet
  if(bulletType == "•"){
    li.style.listStyle =  "disc";
  }
  else if(bulletType == "-"){
    li.style.listStyleType = "square";
  }
  else if(bulletType == "◦"){
    li.style.listStyleType = "circle";
  }
  // Add a checkmark to completed bullets
  if(completed == "true"){
    li.classList.toggle('checked');
  }
}

// Create a bullet from the given inputs
function createBullet(inputValue, bulletType, signifier, parentId = "None"){
  let bulletPostDoc = {
    parentDocId: dailyId,
    signifier: signifier,
    bulletType: bulletType,
    content: inputValue,
    completed: "false",
    date:  document.location.search.substring(1),
    parentBulId: parentId
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
      if(parentId != "None"){
        appendBullet(parentId, inputValue, bulletType, signifier, "false", postData.id);
      }else{
        appendBullet(postData.id, inputValue, bulletType, signifier, "false");
      }

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
  let inputValue = document.getElementById("myInput").value;
  let bulletType = document.getElementById("bullet-type").value;
  let signifier = document.getElementById("signifier").value;
  // Send a request to the database to create a new bullet
  createBullet(inputValue, bulletType, signifier);
}

// Create a new sub list item when clicking on the "Add Sub" button
async function newBulletFromParentBullet() {
  let parentLI = document.getElementById("mySubInput").closest("li");
  let subButton = document.getElementById("mySubInput").closest("li").getElementsByClassName("sub-bullet-button");
  // Send values into append bullet
  let subInputValue = document.getElementById("mySubInput").value;
  let subBulletType = document.getElementById("sub-bullet-type").value;
  let subSignifier = document.getElementById("sub-bullet-container").closest("ul").getAttribute("value");
  let subContainer = document.getElementById("sub-bullet-container");
  subContainer.hidden = true;
  createBullet(subInputValue, subBulletType, subSignifier, parentLI.id);
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