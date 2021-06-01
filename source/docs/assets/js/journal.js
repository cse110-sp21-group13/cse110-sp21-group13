/* eslint-disable no-unused-vars*/
let journalTypeMonth = false;
const queryString = window.location.search;
const params = new URLSearchParams(queryString);
let dailyId;


// Date Title
if (params.get('date').split('-').length === 2) {
  journalTypeMonth = true;
}
const monthName = function(dt) {
  mlist = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return mlist[dt];
};
n = new Date(params.get('date') + ' 00:00:00');
n.toLocaleString('default', {month: 'short'});
y = n.getFullYear();
m = n.getMonth();
d = n.getDate();
const dateHeader =
  journalTypeMonth ? monthName(m) + ' ' + y : monthName(m) + ' ' + d + ', ' + y;
document.getElementById('date').innerHTML = dateHeader;


// Add a "checked" symbol when clicking on a list item
const list = document.querySelectorAll('ul');
list.forEach((listElement) => {
  listElement.addEventListener('click', function(ev) {
    if (ev.target.tagName === 'LI') {
      ev.target.classList.toggle('checked');
    }
    let checkStatus = ev.target.className;

    // Format the checked status for update document creation
    if (checkStatus == 'checked') {
      checkStatus = 'true';
    } else {
      checkStatus = 'false';
    }
    // Create the update document to be sent to the backend
    const bulletUpdateDoc = {
      _id: ev.target.id,
      updateField: {completed: checkStatus},
    };
    // Update the completed field in the bullet on the backend
    $.ajax({
      url: '/update/bullet',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(bulletUpdateDoc),
      success: function(postData) {
        if (postData == 'error') {
          return;
        }
      },
      error: function(xhr, status, error) {
        console.log(status + ' ' + error);
      },
    });
  }, false);
});

/**
 * Loads a daily/monthly from the URL params
 */
async function loadCurrentDay() {
  // Date components
  const splitDateArray = params.get('date').split('-');
  const monthComponent = splitDateArray[0]+'-'+splitDateArray[1];
  const dayComponent = splitDateArray[2];

  // Attempt to get a potential existing daily from the truncated date
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
      // Upon error, it is assumed there is no daily matching the date.
      // Therefore, we must redirect to Migration
      if (getData == 'error' && !journalTypeMonth) {
        const journalPostDoc = {
          day: dayComponent,
          month: monthComponent,
          bullets: [],
        };

        // Form Migration URL
        oldDate = new Date(params.get('date')+ ' 00:00:00');
        oldDate.setDate(oldDate.getDate() - 1);
        oldDateUrl = '/read/daily/' + oldDate.getFullYear() + '-' +
        (oldDate.getMonth() + 1) +'/'+ oldDate.getDate();
        // Get the daily journal from one day ago
        $.ajax({
          url: oldDateUrl,
          type: 'GET',
          contentType: 'application/json',
          success: function(oldDailyData) {
            if (oldDailyData === 'error' || oldDailyData.bullets == '') {
              const journalPostDoc = {
                day: dayComponent,
                month: monthComponent,
                bullets: [],
              };
              // Avoid a migration and create a daily if no old day found or if
              // the previous day has no bullets
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
              });
            } else if (oldDailyData.bullets != '') {
              // If the previous day exists and has bullets, migrate
              window.top.location.replace('migration.html?oldJournal=' +
              oldDate.getFullYear() + '-' +
              (oldDate.getMonth() + 1) + '-' + (oldDate.getDate())+
              '&newJournal='+params.get('date'));
            }
          },
          error: function(xhr, status, error) {
          },
        });
      } else {
        // If the log exists, we must load the entries from the json body.
        // We must also store the existing document's id to pass to bullets
        // during creation.
        dailyId = getData._id;
        getData.bullets.forEach((bullet) =>{
          // Do not display bullet if the entry is null (has been deleted)
          if (bullet == null) {
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
      }
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

  // Ensure empty bullets cannot be added
  if (inputValue === '') {
    alert('You must write something!');
    return;
  }

  // Add deletion button
  const deleteButton = document.createElement('button');
  deleteButton.innerHTML = '-';
  deleteButton.hidden = true;
  deleteButton.className = 'sub-bullet-button';
  deleteButton.addEventListener('click', () =>{
    // Delete parents with no children
    if (childId == 'None') {
      deleteDoc = {_id: bulletId};
      $.ajax({
        url: '/delete/bullet',
        type: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify(deleteDoc),
        success: function(postData) {
        },
        error: function(xhr, status, error) {
          console.log(status + ' ' + error);
          return;
        },
      });
    // Delete children bullets
    } else {
      deleteDoc = {_id: childId};
      $.ajax({
        url: '/delete/bullet',
        type: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify(deleteDoc),
        success: function(postData) {
        },
        error: function(xhr, status, error) {
          console.log(status + ' ' + error);
          return;
        },
      });
    }

    li.hidden = true;

    // Hide categories when the last bullet is deleted
    if ($('#Bullets').children(':visible').length == 0) {
      document.getElementById('bulletTitle').hidden = true;
    }
    if ($('#Priority').children(':visible').length == 0) {
      document.getElementById('priorityTitle').hidden = true;
    }
    if ($('#Inspiration').children(':visible').length == 0) {
      document.getElementById('inspirationTitle').hidden = true;
    }
  });

  li.appendChild(deleteButton);
  li.addEventListener('mouseover', () => {
    deleteButton.hidden = false;
  });
  li.addEventListener('mouseout', () => {
    deleteButton.hidden = true;
  });


  // Append button to parents and add list element to parent id
  if (childId != 'None') {
    const parentBullet = document.getElementById(bulletId);
    // Do not attempt to display child if no parent
    if (parentBullet == null) {
      return;
    }
    let ul = parentBullet.getElementsByTagName('ul');

    li.id = childId;
    if (ul.length == 0) {
      ul = parentBullet.appendChild(document.createElement('ul'));
      ul.className = 'subBulletUl';
      ul.appendChild(li);
    } else {
      ul[0].appendChild(li);
    }
    li.dataset.parent = bulletId;
  } else {
    // If there is no child parameter
    document.getElementById('myInput').value = '';

    // Add subbullet button
    const button = document.createElement('button');
    button.innerHTML = '+';
    button.hidden = true;
    button.className = 'sub-bullet-button';
    button.addEventListener('click', () =>{
      const subContainer = document.getElementById('sub-bullet-container');
      if (subContainer.hidden ) {
        subContainer.hidden = false;
        document.getElementById('sub-bullet-type').hidden = false;
        document.getElementById('mySubInput').hidden = false;
        document.getElementsByClassName('addSubBtn')[0].hidden = false;
      } else if (subContainer.parentElement == li) {
        subContainer.hidden = true;
        document.getElementById('sub-bullet-type').hidden = true;
        document.getElementById('mySubInput').hidden = true;
        document.getElementsByClassName('addSubBtn')[0].hidden = true;
      }

      li.appendChild(subContainer);
    });


    li.appendChild(button);
    li.addEventListener('mouseover', () => {
      button.hidden = false;
    });
    li.addEventListener('mouseout', () => {
      const subAddList = document.getElementById('sub-bullet-container');
      const subAddParent = subAddList.parentElement;
      if (subAddParent != li || subAddList.hidden == true) {
        button.hidden = true;
      }
    });

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

/**
 * Create a bullet in the database
 * @param {string} inputValue The content of the bullet to be created
 * @param {string} bulletType The bullet type displayed next to the li
 * @param {string} signifier The signifier denoting category
 * @param {string} parentId The id of a parent bullet, optional
 */
function createBullet(inputValue, bulletType, signifier, parentId = 'None') {
  const bulletPostDoc = {
    parentDocId: dailyId,
    signifier: signifier,
    bulletType: bulletType,
    content: inputValue,
    completed: 'false',
    date: params.get('date'),
    parentBulId: parentId,
  };
  $.ajax({
    url: '/create/bullet',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(bulletPostDoc),
    success: function(postData) {
      if (postData == 'error') {
        console.log('Creation of new bullet failed.');
        return;
      }
      // Bullet has been created, so add it to the list
      if (parentId != 'None') {
        appendBullet(parentId, inputValue, bulletType, signifier, 'false',
            postData.id);
      } else {
        appendBullet(postData.id, inputValue, bulletType, signifier, 'false');
      }
    },
    error: function(xhr, status, error) {
      console.log(status + ' ' + error);
      return;
    },
  });
}

/**
 * Creates a new bullet when the "add" button is clicked
 */
async function newBulletFromInputBox() {
  // Select all the values from the bullet input
  const inputValue = document.getElementById('myInput').value;
  const bulletType = document.getElementById('bullet-type').value;
  const signifier = document.getElementById('signifier').value;
  // Send a request to the database to create a new bullet
  createBullet(inputValue, bulletType, signifier);
}

/**
 * Create a new bullet that has a parent when the "add" button is clicked
 */
async function newBulletFromParentBullet() {
  const parentLI = document.getElementById('mySubInput').closest('li');
  const subButton = document.getElementById('mySubInput').closest('li')
      .getElementsByClassName('sub-bullet-button');
  // Send values into append bullet
  const subInputValue = document.getElementById('mySubInput').value;
  document.getElementById('mySubInput').value = '';
  const subBulletType = document.getElementById('sub-bullet-type').value;
  const subSignifier = document.getElementById('sub-bullet-container')
      .closest('ul').getAttribute('value');
  const subContainer = document.getElementById('sub-bullet-container');
  subContainer.hidden = true;
  document.getElementById('sub-bullet-type').hidden = true;
  document.getElementById('mySubInput').hidden = true;
  document.getElementsByClassName('addSubBtn')[0].hidden = true;
  createBullet(subInputValue, subBulletType, subSignifier, parentLI.id);
}


/**
 * Hide and unhide the add bullet screen when clicked
 */
function editDaily() {
  const button = document.getElementsByClassName('editBtn')[0].textContent;
  if (button == 'SAVE') {
    document.getElementsByClassName('editBtn')[0].textContent = 'EDIT';
    document.getElementById('bullet-type').hidden = true;
    document.getElementById('signifier').hidden = true;
    document.getElementById('myInput').hidden = true;
    document.getElementsByClassName('addBtn')[0].hidden = true;
  } else {
    document.getElementsByClassName('editBtn')[0].textContent = 'SAVE';
    document.getElementById('bullet-type').hidden = false;
    document.getElementById('signifier').hidden = false;
    document.getElementById('myInput').hidden = false;
    document.getElementsByClassName('addBtn')[0].hidden = false;
  }
}
