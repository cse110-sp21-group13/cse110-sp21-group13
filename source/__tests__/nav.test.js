const puppeteer = require('puppeteer');
let page;
let browser;

describe('Basic user flow for login page', () => {
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

  it('Test 0: sign up with missing password field', async () =>{
    await expect(page).toClick('button', {text: 'get started'});
    await expect(page).toFillForm('form[id=loginform]', {
      username: newUser.username,
      password: newUser.password,
    });
    await expect(page).toClick('button', {text: 'sign up'});
    const error = await page.$eval('#errormsg', (errorMsg) => {
      return errorMsg.innerText;
    });
    if (error.length != 0) {
      expect(error).toBe('username already taken');
      await expect(page).toClick('button', {text: 'log in'});
      await page.waitForNavigation({waitUntil: 'networkidle2'});
      expect(page.url().includes('daily.html')).toBe(true);
    } else {
      await page.waitForNavigation({waitUntil: 'networkidle2'});
      expect(page.url().includes('daily.html')).toBe(true);
    };
  }, 20000);

  let frame;
  it('Test 1: nav bar showing right user name', async () => {
    page.waitForSelector('#nav-frame');
    const elementHandle = await page.$('#nav-frame');
    frame = await elementHandle.contentFrame();
    await frame.waitForSelector('#greeting');
    const greeting = await frame.$eval('#greeting',
        (hello) => {
          return hello.innerText;
        });
    expect(greeting).toBe('Hello ' + newUser.username + '!');
  });

  it('Test 2: daily page showing up', async () =>{
    const button = await frame.$('label[for=hamburger]');
    await button.click();
    const url = await page.url();
    const dailyLog = await frame.$('#hamitems a');
    await dailyLog.click();
    await page.waitForNavigation({waitUntil: 'networkidle2'});
    expect(page.url()).toBe(url);
  });

  it('Test 3: monthly page showing up', async () => {
    page.waitForSelector('#nav-frame');
    const elementHandle = await page.$('#nav-frame');
    frame = await elementHandle.contentFrame();
    const button = await frame.$('label[for=hamburger]');
    await button.click();
    const monthLog = await frame.$('#hamitems a+a');
    await monthLog.click();
    await page.waitForNavigation({waitUntil: 'networkidle2'});
    expect(page.url().includes('calendar.html')).toBe(true);
  });

  it('Test 4: change to dark mode', async () => {
    page.waitForSelector('#nav-frame');
    const elementHandle = await page.$('#nav-frame');
    frame = await elementHandle.contentFrame();
    const button = await frame.$('label[for=hamburger]');
    await button.click();
    const setting = await frame.$('#hamitems a+label');
    await setting.click();
    const darkMode = await frame.$('#modes label[for=dark]');
    await darkMode.click();
    await page.goto('https://journalbullet.herokuapp.com/read/user', {
      waitUntil: 'networkidle2',
    });
    page.on('response', async (response) => {
      expect(response.username).toBe(newUser.username);
      expect(response.style).toBe('dark');
    });
  });

  it('Test 5: go back to last page', async () => {
    await page.goto('https://journalbullet.herokuapp.com/calendar.html', {
      waitUntil: 'networkidle2',
    });
    //page.goBack();
    page.waitForSelector('#nav-frame');
    const elementHandle = await page.$('#nav-frame');
    frame = await elementHandle.contentFrame();
    const button = await frame.$('label[for=hamburger]');
    await button.click();
    const setting = await frame.$('#hamitems a+label');
    await setting.click();
    const darkMode = await frame.$('#modes label[for=light]');
    await darkMode.click();
    await page.goto('https://journalbullet.herokuapp.com/read/user', {
      waitUntil: 'networkidle2',
    });
    page.on('response', async (response) => {
      expect(response.username).toBe(newUser.username);
      expect(response.style).toBe('light');
    });
  });
  afterAll(async () => {
    browser.close();
  });
});
