// Create a "close" button and append it to each list item
var myNodelist = document.getElementsByTagName("LI");
var bulletType = document.getElementById("bullet-type");
var signifier = document.getElementById("signifier");

var i;
for (i = 0; i < myNodelist.length; i++) {
  let span = document.createElement("bulletTypeSpan");
  let txt = document.createTextNode(bulletType.value + " ");
  span.className = "close";
  span.appendChild(txt);
  myNodelist[i].prepend(span);
}

var x;
for (x = 0; x < myNodelist.length; x++) {
  let span = document.createElement("SPAN");
  let txt = document.createTextNode(bulletType.value + " ");
  span.className = "close";
  span.appendChild(txt);
  myNodelist[x].prepend(span);
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

// Create a new list item when clicking on the "Add" button
function newElement() {
  var li = document.createElement("li");
  // Select all the values from the bullet input
  var inputValue = document.getElementById("myInput").value;
  var bulletType = document.getElementById("bullet-type").value;
  var signifier = document.getElementById("signifier").value;
  var date = document.getElementById("date").innerHTML;
  newBulletDocument = {
    //user: ,
    signifier: signifier,
    bulletType: bulletType,
    content: inputValue,
    date: date
  }
/*
  fetch('../create/bullet', {
    method:'POST',
    headers: {
      ''
    }
  })*/

  var t = document.createTextNode(inputValue);
  li.appendChild(t);
  if (inputValue === '') {
    alert("You must write something!");
  } else {
    document.getElementById("myUL").appendChild(li);
  }
  document.getElementById("myInput").value = "";

  var span = document.createElement("SPAN");
  var txt = document.createTextNode(bulletType + " ");
  span.className = "close";
  span.appendChild(txt);
  li.prepend(span);

  for (i = 0; i < close.length; i++) {
    close[i].onclick = function() {
      var div = this.parentElement;
      div.style.display = "none";
    }
  }
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