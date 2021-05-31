/* eslint-disable no-unused-vars*/
let journalTypeMonth = false;
const queryString = window.location.search;
const params = new URLSearchParams(queryString);
let dailyId;

// Query args should be of the form oldJournal=year-month-day,
// newJournal=year-month-day

// Date Title
if (params.get('oldJournal').split('-').length === 2) {
  journalTypeMonth = true;
}
const monthName = function(dt) {
  mlist = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return mlist[dt];
};
n = new Date(params.get('oldJournal') + ' 00:00:00');
n.toLocaleString('default', {month: 'short'});
y = n.getFullYear();
m = n.getMonth();
d = n.getDate();
const dateHeader = 'Migration ' +
(journalTypeMonth ? monthName(m) + ' ' + y : monthName(m) + ' ' + d + ', ' + y);
document.getElementById('date').innerHTML = dateHeader;

/**
 * Submits the migration and creates the journal
 */
function submit() {
  const splitDateArray = params.get('newJournal').split('-');
  const monthComponent = splitDateArray[0]+'-'+splitDateArray[1];
  const dayComponent = splitDateArray[2];
  const migratedBullets = [];

  // Collect all selected bullets and the parents of any subbullets
  const bullets = document.querySelectorAll('li.selected');
  for (const bullet of bullets) {
    if (bullet.dataset.parent) {
      if (!migratedBullets.includes(bullet.dataset.parent)) {
        migratedBullets.push(bullet.dataset.parent);
      }
    }
    migratedBullets.push(bullet.id);
  }

  // Create the daily journal that stores the bullets being migrated
  const journalPostDoc = {
    day: dayComponent,
    month: monthComponent,
    bullets: migratedBullets,
  };
  $.ajax({
    url: '/create/daily',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(journalPostDoc),
    success: function(postData) {
      if (postData == 'error') {
        console.log('Creation of new daily failed.');
      } else {
        dailyId = postData.id;
      }
    },
    error: function(xhr, status, error) {
      console.log(status + ' ' + error);
    },
  }).then(() => {
    // Redirect to the newly created daily
    window.location.replace('daily.html?date='+params.get('newJournal'));
  });
}

// Add a "checked" symbol when clicking on a list item
const list = document.querySelectorAll('ul');
list.forEach((listElement) => {
  listElement.addEventListener('click', function(ev) {
    if (ev.target.tagName === 'LI') {
      ev.target.classList.toggle('selected');
    }
  }, false);
});

/**
 * Loads a daily/monthly from the URL params
 */
async function loadCurrentDay() {
  // Date components
  const splitDateArray = params.get('oldJournal').split('-');
  const monthComponent = splitDateArray[0]+'-'+
                         splitDateArray[1];
  const dayComponent = splitDateArray[2];

  // Attempt to get an existing daily from the truncated date
  // generated.
  let reqUrl = '/read/daily/' + monthComponent+'/' + dayComponent;
  if (journalTypeMonth) {
    reqUrl = '/read/month/' + monthComponent;
  }
  $.ajax({
    url: reqUrl,
    type: 'GET',
    contentType: 'application/json',
    success: function(getData) {
      // If the log exists, we must load the entries from the json body.
      // We must also store the existing document's id to pass to bullets
      // during creation.
      dailyId = getData._id;
      if (!getData.bullets) {
        submit();
      }
      getData.bullets.forEach((bullet) =>{
        if (!bullet._id) {
          return;
        }
        if (bullet.parentBulId != 'None') {
          appendBullet(bullet.parentBulId, bullet.content, bullet.bulletType,
              bullet.signifier, bullet.completed, bullet._id);
        } else {
          appendBullet(bullet._id, bullet.content, bullet.bulletType,
              bullet.signifier, bullet.completed);
        }
      });
    },
    error: function(xhr, status, error) {
      console.log(status + ' ' + error);
    },
  });
}

loadCurrentDay();

/**
 * Appends a bullet into the bullet container
 *
 * @param {string} bulletId The bullet id of the parent, or of the bullet itself
 * @param {string} inputValue The content of the bullet being added
 * @param {string} bulletType The type of the bullet that shows up next to the
 * bullet
 * @param {string} signifier The category of the bullet
 * @param {string} completed Whether or not a bullet has been completed
 * @param {string} childId Optional, is the ID of the bullet if it has a parent
 */
function appendBullet(bulletId, inputValue, bulletType, signifier, completed,
    childId = 'None') {
  const li = document.createElement('li');
  const t = document.createTextNode(inputValue);
  li.id = bulletId;
  li.appendChild(t);

  // Append button to parents and add list element to parent id
  if (childId != 'None') {
    const parentBullet = document.getElementById(bulletId);
    let ul = parentBullet.getElementsByTagName('ul');
    ul.class = 'subBulletUl';
    li.id = childId;
    if (ul.length == 0) {
      ul = parentBullet.appendChild(document.createElement('ul'));
      ul.appendChild(li);
    } else {
      ul[0].appendChild(li);
    }
    li.dataset.parent = bulletId;
  } else {
    // Add bullets to category based on their signifier
    if (signifier == ' ') {
      document.getElementById('Bullets').appendChild(li);
      document.getElementById('bulletTitle').hidden = false;
    } else if (signifier == '*') {
      document.getElementById('Priority').appendChild(li);
      document.getElementById('priorityTitle').hidden = false;
    } else if (signifier == '!') {
      document.getElementById('Inspiration').appendChild(li);
      document.getElementById('inspirationTitle').hidden = false;
    }
  }

  // Change the bullet list style to the necessary type of bullet
  if (bulletType == '•') {
    li.style.listStyleType = 'disc';
  } else if (bulletType == '-') {
    li.style.listStyleType = 'square';
  } else if (bulletType == '◦') {
    li.style.listStyleType = 'circle';
  }
  // Add a checkmark to completed bullets
  if (completed == 'true') {
    li.classList.toggle('checked');
  }
}


