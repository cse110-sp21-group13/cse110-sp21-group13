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
    'username': 'test',
    'password': '12345',
  };

   it('Test 0: sign up with new user', async () =>{
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

  it('Test 2: page title', async () => {
    expect(page.title().includes('Monthly')).toBe(true);
  });

  // enable successful run next time
  it('Test 7: delete user', async () => {
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
