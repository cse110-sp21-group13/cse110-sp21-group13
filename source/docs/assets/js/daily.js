/* eslint-disable no-unused-vars*/
const iframe = document.getElementById('journal-frame');
const params = new URLSearchParams(window.location.search);
let queryString = window.location.search;
iframe.src = 'journal.html' + window.location.search;
if (queryString == '') {
  const n = new Date();
  queryString = 'date='+ n.getFullYear() + '-' +
                (n.getMonth() + 1) + '-' + (n.getDate());
  journalTypeMonth = queryString.split('-').length === 3;
  window.location.search = queryString;
}

/**
 * Switches the daily to the next day by setting the url parms
 */
function nextView() {
  const d = new Date(params.get('date') + ' 00:00:00');
  d.setDate(d.getDate() + 1);
  window.location.search = 'date='+ d.getFullYear() + '-' +
                           (d.getMonth() + 1) + '-' + (d.getDate());
  iframe.src = 'journal.html' + window.location.search;
}

/**
 * Switches the daily to the previous day by setting the url parms
 */
function previousView() {
  const d = new Date(params.get('date') + ' 00:00:00');
  d.setDate(d.getDate() - 1);
  window.location.search = 'date='+ d.getFullYear() + '-' +
                           (d.getMonth() + 1) + '-' + (d.getDate());
  iframe.src = 'journal.html' + window.location.search;
}

/* Hides 'next' button if date is current */
const n = new Date();
const date = n.getFullYear() + '-' + (n.getMonth() + 1) + '-' + n.getDate();
if (date === params.get('date')) {
  const nextBtn = document.getElementsByClassName('nextBtn')[0];
  nextBtn.style.display = 'none';
}
