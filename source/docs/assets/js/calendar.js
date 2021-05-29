currDate = new Date();  // Use current month on initial page load
let backButton = document.getElementById("back");
let forwardButton = document.getElementById("forward");
let iframe = document.getElementById("journal-frame")

// Go back a month
backButton.addEventListener("click", () => {
  currDate.setMonth(currDate.getMonth()-1);  // Decrement Month
  updateCalendar(currDate.getMonth() + 1, currDate.getFullYear(), currDate)
});

// Go forward a month
forwardButton.addEventListener("click", () => {
  currDate.setMonth(currDate.getMonth()+1);  // Increment Month
  updateCalendar(currDate.getMonth() + 1, currDate.getFullYear(), currDate)
});

// On page load listener
window.addEventListener("DOMContentLoaded", () => {
  updateCalendar(currDate.getMonth() + 1, currDate.getFullYear(), currDate)
});

function updateCalendar(month, year, date) {
  let currMonth = new Date(year, month - 1);
  let daysInMonth = new Date(year, month, 0).getDate();
  let calendar = document.getElementById("calendar");
  let globalItr = 0;

  // Remove old cells
  let dayCells = document.getElementsByName("calendar-day");
  let dayCellsLen = dayCells.length;

  for(let i = 0; i < dayCellsLen; i++) {
      dayCells[0].remove();
  }

  // Set month title
  let calTitle = document.getElementById("calendar-title");
  calTitle.textContent = date.getFullYear() + "/" + (date.getMonth() + 1);


  let monthData;

  $.ajax({
      url: "/read/month/" + date.getFullYear() + "-" + (date.getMonth() + 1),
      type: "GET",
      async: false,
      success: function(retData) {
          monthData = retData;
      },
      error: function() {
          console.log("error");
      }
  });

  if(monthData === "error") {
    let newMonthData = {
      month: (date.getFullYear() + "-" + (date.getMonth() + 1)),
      bullets: []
    }

    $.ajax({
        url: "/create/month/",
        type: "POST",
        async: false,
        contentType: "application/json",
        data: JSON.stringify(newMonthData),
        success: function(retData) {
            monthData = retData;
        },
        error: function() {
            console.log("error");
        }
    });
  }

  for(let i = 0; i < currMonth.getDay(); i++) {  // Put in empty days for month
      let cell = document.createElement("div");
      cell.setAttribute("class", "grid-item-dates");
      cell.setAttribute("name", "calendar-day");
      calendar.appendChild(cell);
      globalItr++;
  }

  for(let i = 1; i <= daysInMonth; i++) {  // Populate valid days
      let cell = document.createElement("div");
      cell.setAttribute("class", "grid-item-dates");
      cell.setAttribute("name", "calendar-day");

      try {
          if(monthData.dailys.length === 0)  // Account for no dailies case
            throw Error();

          let found = false;
          monthData.dailys.docs.forEach((daily) => {
              if(daily.day == i) {
                  let link = document.createElement("a");
                  link.setAttribute("href", "/daily.html?date=" + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + i);
                  link.innerText = i;
                  cell.appendChild(link);
                  found = true;
              }
          });

          if(!found)
            cell.innerText = i;
      } catch(Error) {
          // If month doesn't exist the monthData will be empty
          cell.innerText = i;
      }

      calendar.appendChild(cell);
      globalItr++;
  }

  for(let i = 0; i < globalItr%7; i++) {  // Put in empty trailing days for month
      let cell = document.createElement("div");
      cell.setAttribute("class", "grid-item-dates");
      cell.setAttribute("name", "calendar-day");
      calendar.appendChild(cell);
      globalItr++;
  }

  iframe.src = "journal.html?date=" + (date.getFullYear() + "-" + (date.getMonth() + 1));
}
