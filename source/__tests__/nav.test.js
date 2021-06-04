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

  it('Test 5: sign up with missing password field', async () =>{
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
    };
  }, 20000);

  afterAll(async () => {
    browser.close();
  });
});