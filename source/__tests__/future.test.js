const puppeteer = require('puppeteer');
let page;
let browser;

describe('Basic user flow for monthly page', () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({headless: true,
      slowMo: 100, testTimeout: 50000});
    page = await browser.newPage();
    await page.setViewport({
      width: 800,
      height: 1000,
    });
    await page.goto('https://journalbullet.herokuapp.com');
  });

  const newUser = {
    'username': 'testMonthly',
    'password': '12345',
  };

  it('Test 0: sign up with new user', async () => {
    await expect(page).toClick('button', {text: 'get started'});
    await expect(page).toFillForm('form[id=loginform]', {
      username: newUser.username,
      password: newUser.password,
    });
    await expect(page).toClick('button', {text: 'sign up'});

    await page.waitForNavigation({waitUntil: 'networkidle2'});
    expect(page.url().includes('daily.html')).toBe(true);
  }, 20000);

  it('Test 1: navigate to month page', async () => {
    await page.goto('https://journalbullet.herokuapp.com/calendar.html');
    expect(page.url().includes('calendar.html')).toBe(true);
  });

  it('Test 2: navigate to future log', async () => {
    let elementHandle = await page.$('#journal-frame');
    frame = await elementHandle.contentFrame();
    const nextBtn = await page.$('.nextBtn');
    await nextBtn.click();

    // get current date
    const d = new Date();
    d.toLocaleString('default', {month: 'short'});
    d.setMonth(d.getMonth() + 1, 1);
    const y = d.getFullYear();
    const m = d.getMonth();

    // check date heading
    elementHandle = await page.$('#journal-frame');
    frame = await elementHandle.contentFrame();
    const date = await frame.$eval('#date',
        (date) => {
          return date.innerText;
        });
    expect(date).toBe(`${monthName(m)} ${y}`);
  });

  it('Test 3: page title', async () => {
    const title = await page.title();
    expect(title.includes('Monthly')).toBe(true);
  });

  let frame;
  it('Test 4: month heading', async () => {
    // get current date
    const d = new Date();
    d.toLocaleString('default', {month: 'short'});
    d.setMonth(d.getMonth() + 1, 1);
    const y = d.getFullYear();
    const m = d.getMonth();

    // check date heading
    const elementHandle = await page.$('#journal-frame');
    frame = await elementHandle.contentFrame();
    const date = await frame.$eval('#date',
        (date) => {
          return date.innerText;
        });
    expect(date).toBe(`${monthName(m)} ${y}`);
  });

  it('Test 5: add a new bullet', async () => {
    const elementHandle = await page.$('#journal-frame');
    frame = await elementHandle.contentFrame();

    // click add button
    await frame.waitForSelector('.editBtn');
    await expect(frame).toClick('.editBtn');
    await frame.$eval('#myInput', (e) => e.value = 'This is a monthly bullet');
    await frame.waitForSelector('.addBtn');
    await expect(frame).toClick('.addBtn');
  }, 20000);

  it('Test 6: check bullet in list', async () => {
    const elementHandle = await page.$('#journal-frame');
    const frame = await elementHandle.contentFrame();
    await frame.waitForSelector('li');
    const bullet = await frame.evaluate(() => {
      return document.getElementsByTagName('li').length;
    });
    expect(bullet).toBe(1);
  });

  it('test 7: delete bullet', async () => {
    const elementHandle = await page.$('#journal-frame');
    const frame = await elementHandle.contentFrame();

    await frame.evaluate((_) => {
      const deleteButton =
      document.getElementsByClassName('sub-bullet-button')[0];
      deleteButton.hidden = false;
    });
    await expect(frame).toClick('button', {text: '-'});
  }, 20000);

  it('test 8: refresh page', async () => {
    await page.reload({waitUntil: ['networkidle0', 'domcontentloaded']});
  }, 20000);

  it('Test 9: navigate to future log', async () => {
    let elementHandle = await page.$('#journal-frame');
    frame = await elementHandle.contentFrame();
    const nextBtn = await page.$('.nextBtn');
    await nextBtn.click();

    // get current date
    const d = new Date();
    d.toLocaleString('default', {month: 'short'});
    d.setMonth(d.getMonth() + 1, 1);
    const y = d.getFullYear();
    const m = d.getMonth();

    // check date heading
    elementHandle = await page.$('#journal-frame');
    frame = await elementHandle.contentFrame();
    const date = await frame.$eval('#date',
        (date) => {
          return date.innerText;
        });
    expect(date).toBe(`${monthName(m)} ${y}`);
  });

  it('Test 10: check number of bullets in list', async () => {
    const elementHandle = await page.$('#journal-frame');
    const frame = await elementHandle.contentFrame();
    await frame.waitForSelector('ul');
    const bullet = await frame.evaluate(() => {
      return document.getElementsByTagName('li').length;
    });
    expect(bullet).toBe(0);
  });

  it('test 11: add entry with type and signifier', async () => {
    const elementHandle = await page.$('#journal-frame');
    const frame = await elementHandle.contentFrame();

    await frame.waitForSelector('.editBtn');
    await expect(frame).toClick('.editBtn');
    await frame.select('#signifier', '!');
    await frame.select('#bullet-type', '-');
    await frame.$eval('#myInput', (e) =>
      e.value = 'This is a another monthly bullet');
    await frame.waitForSelector('.addBtn');
    await expect(frame).toClick('.addBtn');
  }, 20000);

  it('Test 12: number of bullets should be 1', async () => {
    const elementHandle = await page.$('#journal-frame');
    const frame = await elementHandle.contentFrame();
    await frame.waitForSelector('li');
    const bullet = await frame.evaluate(() => {
      return document.getElementsByTagName('li').length;
    });
    expect(bullet).toBe(1);
  });

  it('test 13: add sub-bullet', async () => {
    const elementHandle = await page.$('#journal-frame');
    const frame = await elementHandle.contentFrame();

    await frame.evaluate((_) => {
      const addSubButton = document.getElementsByClassName('sub-bullet-button');
      let i;
      for (i = 0; i < addSubButton.length; i++) {
        addSubButton[i].hidden = false;
      }
    });

    await expect(frame).toClick('button', {text: '+'});

    await frame.select('#sub-bullet-type', '-');
    await frame.$eval('input[id=mySubInput]',
        (el) => el.value = 'Testing add a sub bullet');
    const subAdd = await frame.$('.addSubBtn');
    await subAdd.click();
  }, 20000);

  it('test 14: refresh page', async () => {
    await page.reload({waitUntil: ['networkidle0', 'domcontentloaded']});
  }, 20000);

  it('Test 15: navigate to future log', async () => {
    let elementHandle = await page.$('#journal-frame');
    frame = await elementHandle.contentFrame();
    const nextBtn = await page.$('.nextBtn');
    await nextBtn.click();

    // get current date
    const d = new Date();
    d.toLocaleString('default', {month: 'short'});
    d.setMonth(d.getMonth() + 1, 1);
    const y = d.getFullYear();
    const m = d.getMonth();

    // check date heading
    elementHandle = await page.$('#journal-frame');
    frame = await elementHandle.contentFrame();
    const date = await frame.$eval('#date',
        (date) => {
          return date.innerText;
        });
    expect(date).toBe(`${monthName(m)} ${y}`);
  });

  it('test 16: check bullet length', async () => {
    const elementHandle = await page.$('#journal-frame');
    const frame = await elementHandle.contentFrame();
    await frame.waitForSelector('ul');
    const bulletLength = await frame.evaluate((_) => {
      const bulletL = document.getElementsByTagName('li').length;
      return bulletL;
    });
    await expect(bulletLength).toBe(2);
  }, 20000);

  it('test 17: delete bullet', async () => {
    const elementHandle = await page.$('#journal-frame');
    const frame = await elementHandle.contentFrame();

    await frame.evaluate((_) => {
      // this will be executed within the page, that was loaded before
      const deleteButton =
      document.getElementsByClassName('sub-bullet-button')[0];
      deleteButton.hidden = false;
    });
    await expect(frame).toClick('button', {text: '-'});
  }, 20000);

  it('test 18: go to current month', async () => {
    let elementHandle = await page.$('#journal-frame');
    frame = await elementHandle.contentFrame();
    const previousBtn = await page.$('.previousBtn');
    await previousBtn.click();

    // get current date
    const d = new Date();
    d.toLocaleString('default', {month: 'short'});
    const y = d.getFullYear();
    const m = d.getMonth();

    // check date heading
    elementHandle = await page.$('#journal-frame');
    frame = await elementHandle.contentFrame();
    const date = await frame.$eval('#date',
        (date) => {
          return date.innerText;
        });
    expect(date).toBe(`${monthName(m)} ${y}`);
  }, 20000);

  it('test 19: go back to future month', async () => {
    let elementHandle = await page.$('#journal-frame');
    frame = await elementHandle.contentFrame();
    const nextBtn = await page.$('.nextBtn');
    await nextBtn.click();

    // get current date
    const d = new Date();
    d.toLocaleString('default', {month: 'short'});
    d.setMonth(d.getMonth() + 1, 1);
    const y = d.getFullYear();
    const m = d.getMonth();

    // check date heading
    elementHandle = await page.$('#journal-frame');
    frame = await elementHandle.contentFrame();
    const date = await frame.$eval('#date',
        (date) => {
          return date.innerText;
        });
    expect(date).toBe(`${monthName(m)} ${y}`);
  }, 20000);

  it('test 20: go to next future month', async () => {
    let elementHandle = await page.$('#journal-frame');
    frame = await elementHandle.contentFrame();
    const nextBtn = await page.$('.nextBtn');
    await nextBtn.click();

    // get current date
    const d = new Date();
    d.toLocaleString('default', {month: 'short'});
    d.setMonth(d.getMonth() + 2, 1);
    const y = d.getFullYear();
    const m = d.getMonth();

    // check date heading
    elementHandle = await page.$('#journal-frame');
    frame = await elementHandle.contentFrame();
    const date = await frame.$eval('#date',
        (date) => {
          return date.innerText;
        });
    expect(date).toBe(`${monthName(m)} ${y}`);
  }, 20000);

  // enable successful run next time
  it('Test 21: delete user', async () => {
    page.waitForSelector('#nav-frame');
    const elementHandle = await page.$('#nav-frame');
    frame = await elementHandle.contentFrame();
    const button = await frame.$('label[for=hamburger]');
    await button.click();
    await expect(frame).toClick('label', {text: 'Settings v'});
    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });
    await expect(frame).toClick('button', {text: 'Delete Account'});
    await page.waitForNavigation({waitUntil: 'networkidle2'});
    expect(page.url()).toBe('https://journalbullet.herokuapp.com/index.html');
  });

  afterAll(async () => {
    browser.close();
  });
});

const monthName = function(dt) {
  mlist = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return mlist[dt];
};