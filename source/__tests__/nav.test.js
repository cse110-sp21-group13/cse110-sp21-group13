const puppeteer = require('puppeteer');
let page;
let browser;

describe('Basic user flow for login page', () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({headless: true,
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

    await page.waitForNavigation({waitUntil: 'networkidle2'});
    expect(page.url().includes('daily.html')).toBe(true);
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

  it('Test 2: top nav bar logo showing up correctly', async () => {
    const logoSrc = await frame.$eval('.topbar #barlogo', (logoImage) => {
      return logoImage.src;
    });
    const logoAlt = await frame.$eval('.topbar #barlogo', (logoImage) => {
      return logoImage.alt;
    });
    expect(logoSrc.includes('assets/images/logo.svg'));
    expect(logoAlt).toBe('a smiling black cat');
  });

  it('Test 3: top nav bar title showing up correctly', async () => {
    const titleSrc = await frame.$eval('.topbar #bartitle', (titleImage) => {
      return titleImage.src;
    });
    const titleAlt = await frame.$eval('.topbar #bartitle', (titleImage) => {
      return titleImage.alt;
    });
    expect(titleSrc.includes('assets/images/13ullet.svg'));
    expect(titleAlt).toBe('13Bullet');
  });

  it('Test 4: daily page showing up', async () =>{
    const button = await frame.$('label[for=hamburger]');
    await button.click();
    const url = await page.url();
    await expect(frame).toClick('a', {text: 'Daily Log'});
    await page.waitForNavigation({waitUntil: 'networkidle2'});
    expect(page.url()).toBe(url);
  });

  it('Test 5: monthly page showing up', async () => {
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

  it('Test 6: check popup content', async () => {
    page.waitForSelector('#nav-frame');
    const elementHandle = await page.$('#nav-frame');
    frame = await elementHandle.contentFrame();
    const button = await frame.$('label[for=hamburger]');
    await button.click();
    await expect(frame).toClick('label', {text: 'Settings v'});
    await expect(frame).toClick('li', {text: 'Change password'});
    const popupText1 = await frame.$eval('label[for=old]',
        (text) => {
          return text.innerText;
        });
    expect(popupText1).toBe('Please enter your old password');
    const popupText2 = await frame.$eval('label[for=new]',
        (text) => {
          return text.innerText;
        });
    expect(popupText2).toBe('New password');
  });

  it('Test 7: change password', async () => {
    await frame.$eval('input[id=old]', (el) => el.value = '12345');
    await frame.$eval('input[id=new]', (el) => el.value = '2233');
    await expect(frame).toClick('button', {text: 'Submit'});
    await expect(frame).toClick('button', {text: 'okay'});
  });

  it('Test 8: sign out', async () => {
    await expect(frame).toClick('button', {text: 'SIGN OUT'});
    await page.waitForNavigation({waitUntil: 'networkidle2'});
    expect(page.url()).toBe('https://journalbullet.herokuapp.com/');
  });

  const updateUser ={
    'username': 'test',
    'password': '2233',
  };
  it('Test 9: resign in', async () => {
    await expect(page).toClick('button', {text: 'get started'});
    await expect(page).toFillForm('form[id=loginform]', {
      username: updateUser.username,
      password: updateUser.password,
    });
    await expect(page).toClick('button', {text: 'log in'});
    await page.waitForNavigation({waitUntil: 'networkidle2'});
    expect(page.url().includes('daily.html')).toBe(true);
  }, 20000);

  it('Test 10: change to dark mode', async () => {
    page.waitForSelector('#nav-frame');
    const elementHandle = await page.$('#nav-frame');
    frame = await elementHandle.contentFrame();
    const button = await frame.$('label[for=hamburger]');
    await button.click();
    const setting = await frame.$('#hamitems a+label');
    await setting.click();
    const darkMode = await frame.$('#modes label[for=dark]');
    await darkMode.click();
  });


  it('Test 11: check the body background color', async () => {
    await page.waitForSelector('body');
    const backgroundColor = await page.$eval('body', (el) =>
      getComputedStyle(el).getPropertyValue('background-color'));
    expect(backgroundColor).toBe('rgb(25, 11, 55)');
  });

  it('Test 12: change to high contrast mode', async () => {
    page.waitForSelector('#nav-frame');
    const elementHandle = await page.$('#nav-frame');
    frame = await elementHandle.contentFrame();
    const button = await frame.$('label[for=hamburger]');
    await button.click();
    const setting = await frame.$('#hamitems a+label');
    await setting.click();
    const contrastMode = await frame.$('#modes label[for=contrast]');
    await contrastMode.click();
  });

  it('Test 13: check the input background color', async () => {
    await page.waitForSelector('body');
    const backgroundColor = await page.$eval('body', (el) =>
      getComputedStyle(el).getPropertyValue('background-color'));
    expect(backgroundColor).toBe('rgb(9, 3, 21)');
  });

  it('Test 14: delete user', async () => {
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
