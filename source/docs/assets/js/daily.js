// Change the URL parameter to the next day, which forces a reload to the next day
let iframe = document.getElementById("journal-frame");
let params = new URLSearchParams(window.location.search);
let queryString = window.location.search;
iframe.src = "journal.html" + window.location.search;
console.log(window.location.search);
console.log(queryString);
if(queryString == ""){
    let n = new Date();
    queryString = "date="+ n.getFullYear() + "-" + (n.getMonth() + 1) + "-" + (n.getDate());
    journalTypeMonth = queryString.split("-").length === 3;
    window.location.search = queryString;
  }

function nextView(){
    let d = new Date(params.get("date"));
    d.setDate(d.getDate() + 1);
    window.location.search = "date="+ d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + (d.getDate());
    console.log(window.location.search);
    iframe.src = "journal.html" + window.location.search;
  }
  
// Change the URL parameter to the previous day, which forces a reload to the previous day
function previousView(){
    let d = new Date(params.get("date"));
    d.setDate(d.getDate() - 1);
    window.location.search = "date="+ d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + (d.getDate());
    iframe.src = "journal.html" + window.location.search;
}