currDate = new Date(); // Use current month on initial page load
currDate.setDate(1); // Always set to first day of the month
const backButton = document.getElementById('back');
const forwardButton = document.getElementById('forward');
const iframe = document.getElementById('journal-frame');
//console.log('Testing Build');
// Go back a month
backButton.addEventListener('click', () => {
  currDate.setMonth(currDate.getMonth()-1); // Decrement Month
  updateCalendar(currDate.getMonth() + 1, currDate.getFullYear(), currDate);
});

// Go forward a month
forwardButton.addEventListener('click', () => {
  currDate.setMonth(currDate.getMonth()+1); // Increment Month
  updateCalendar(currDate.getMonth() + 1, currDate.getFullYear(), currDate);
});

// On page load listener
window.addEventListener('DOMContentLoaded', () => {
  updateCalendar(currDate.getMonth() + 1, currDate.getFullYear(), currDate);
});

/**
 * Updates the calendar
 * @param {*} month the month component of the date
 * @param {*} year the year component of the date
 * @param {*} date the date component
 */
function updateCalendar(month, year, date) {
  const currMonth = new Date(year, month - 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const calendar = document.getElementById('calendar');
  let globalItr = 0;

  // Remove old cells
  const dayCells = document.getElementsByName('calendar-day');
  const dayCellsLen = dayCells.length;

  for (let i = 0; i < dayCellsLen; i++) {
    dayCells[0].remove();
  }

  let monthData;

  do {
    $.ajax({
      url: '/read/month/' + date.getFullYear() + '-' + (date.getMonth() + 1),
      type: 'GET',
      async: false,
      success: function(retData) {
        monthData = retData;
      },
      error: function() {
        console.log('error');
      },
    });

    if (monthData === 'error') {
      const newMonthData = {
        month: (date.getFullYear() + '-' + (date.getMonth() + 1)),
        bullets: [],
      };

      $.ajax({
        url: '/create/month/',
        type: 'POST',
        async: false,
        contentType: 'application/json',
        data: JSON.stringify(newMonthData),
        error: function() {
          console.log('error');
        },
      });
    }
  } while (monthData === 'error');

  for (let i = 0; i < currMonth.getDay(); i++) { // Put in empty days for month
    const cell = document.createElement('div');
    cell.setAttribute('class', 'grid-item-dates');
    cell.setAttribute('name', 'calendar-day');
    calendar.appendChild(cell);
    globalItr++;
  }
  for (let i = 1; i <= daysInMonth; i++) { // Populate valid days
    const cell = document.createElement('div');
    cell.setAttribute('class', 'grid-item-dates');
    cell.setAttribute('name', 'calendar-day');

    try {
      if (monthData.dailys.length === 0) { // Account for no dailies case
        throw Error();
      }

      let found = false;
      monthData.dailys.forEach((daily) => {
        if (daily.day == i) {
          const link = document.createElement('a');
          link.setAttribute('href', '/daily.html?date=' +
            date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + i);
          link.innerText = i;
          cell.appendChild(link);
          cell.setAttribute('data-contains-daily', 'true');
          found = true;
        }
      });

      if (!found) {
        cell.innerText = i;
      }
    } catch (Error) {
      // If month doesn't exist the monthData will be empty
      cell.innerText = i;
    }

    calendar.appendChild(cell);
    globalItr++;
  }

  // Put in empty trailing days for month
  for (let i = 0; i < globalItr%7; i++) {
    const cell = document.createElement('div');
    cell.setAttribute('class', 'grid-item-dates');
    cell.setAttribute('name', 'calendar-day');
    calendar.appendChild(cell);
    globalItr++;
  }

  iframe.src = 'journal.html?date=' +
    (date.getFullYear() + '-' + (date.getMonth() + 1));
}
