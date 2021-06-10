const puppeteer = require('puppeteer');
let page;
let browser;

describe('Basic user flow for monthly page', () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({headless: false,
      slowMo: 100, testTimeout: 50000});
    page = await browser.newPage();
    await page.goto('https://journalbullet.herokuapp.com');
  });

  const newUser = {
    'username': 'testCalendar',
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

  it('test 2: refresh page', async () => {
    await page.reload({waitUntil: ['networkidle0', 'domcontentloaded']});
  }, 20000);

  it('test 3: check if current day has a daily', async () => {
    // current day
    const n = new Date();
    const day = n.getDate();

    page.waitForSelector('#calendar');
    const gridHandle = await page.$('.grid-container');
    const dailyDate =
      await gridHandle.$$eval('.grid-item-dates', (nodes) => {
        return nodes.filter((n) => n.hasAttribute('data-contains-daily'))
            .map((n) => n.innerText);
      });
    expect(parseInt(dailyDate[0])).toBe(day);
  }, 20000);

  it('test 4: clicking current day should navigate to daily', async () => {
    page.waitForSelector('#calendar');
    const gridHandle = await page.$('.grid-container');
    const dailyDate =
      await gridHandle.$$eval('.grid-item-dates', (nodes) => {
        return nodes.filter((n) => n.hasAttribute('data-contains-daily'))
            .map((n) => n.firstChild)
            .map((n) => n.href);
      });

    await expect(page).toClick('a', {href: dailyDate[0]});
    await page.waitForNavigation({waitUntil: 'networkidle2'});
    expect(page.url().includes('daily.html')).toBe(true);
  }, 20000);

  it('test 5: go back to calendar page', async () => {
    await page.goBack();
    expect(page.url().includes('calendar.html')).toBe(true);
  }, 20000);

  it('test 6: should only be 1 date with daily', async () => {
    page.waitForSelector('#calendar');
    const gridHandle = await page.$('.grid-container');
    const dailyDates =
      await gridHandle.$$eval('.grid-item-dates', (nodes) => {
        return nodes.filter((n) => n.hasAttribute('data-contains-daily'));
      });
    expect(dailyDates.length).toBe(1);
  }, 20000);

  it('test 7: should only be 1 date with daily', async () => {
    page.waitForSelector('#calendar');
    const gridHandle = await page.$('.grid-container');
    const dailyDates =
      await gridHandle.$$eval('.grid-item-dates', (nodes) => {
        return nodes.filter((n) => n.hasAttribute('data-contains-daily'));
      });
    expect(dailyDates.length).toBe(1);
  }, 20000);

  it('test 8: next month should have zero dailies', async () => {
    // navigate to next month
    const elementHandle = await page.$('#journal-frame');
    frame = await elementHandle.contentFrame();
    const nextBtn = await page.$('.nextBtn');
    await nextBtn.click();

    // check number of dailies in calendar
    page.waitForSelector('#calendar');
    const gridHandle = await page.$('.grid-container');
    const dailyDates =
      await gridHandle.$$eval('.grid-item-dates', (nodes) => {
        return nodes.filter((n) => n.hasAttribute('data-contains-daily'));
      });
    expect(dailyDates.length).toBe(0);
  }, 20000);

  // enable successful run next time
  it('Test 9: delete user', async () => {
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
