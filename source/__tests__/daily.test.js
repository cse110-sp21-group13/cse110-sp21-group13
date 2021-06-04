const { puppeteerErrors } = require("puppeteer");
const puppeteer = require('puppeteer');
let page;
let browser;

describe ('Basic user flow for login page', () => {
    beforeAll(async () => {
        browser = await puppeteer.launch({headless: false, slowMo: 100, testTimeout: 30000,});
        page = await browser.newPage();
        await page.goto('https://journalbullet.herokuapp.com');
        // await page.waitForTimeout(500);
    });

    const user = {
        'username': 'cameron3',
        'password': '123456',
    };

    it('Test 1: click get started button and get to login', async () => {
        // await expect(page).toClick('button', {id: 'getstarted'});
        page.click('button', {text: 'get started'})
        // await page.waitForNavigation();

        let name = await page.$eval('#loginform > label', (username) => {return username.textContent;});
        let password = await page.$eval('#loginform input+label', (key) => {return key.textContent;});
        expect(name).toBe('Name');
        expect(password).toBe('Password');
    }, 100000);


    it('test 2: sign up with new user or log in with existing user', async () => {
        await expect(page).toFillForm('form[id=loginform]',{
            username: user.username,
            password: user.password,
        });
        await expect(page).toClick('button', {text: 'sign up'});
        let error = await page.$eval('#errormsg', (errorMsg) => {return errorMsg.innerText;});
        if(error.length != 0){
            expect(error).toBe('username already taken');
            await expect(page).toClick('button', {text: 'log in'});
            await page.waitForNavigation({waitUntil: 'networkidle2'});
            expect(page.url().includes('daily.html')).toBe(true);
        };
        expect(page.url().includes('daily.html')).toBe(true);

    }, 20000);

    it('test 3: click add button', async () => {
        await page.waitForSelector("iframe");
        const elementHandle = await page.$('#journal-frame');
        const frame = await elementHandle.contentFrame();
        // await frame.waitForSelector('#editBtn');
        // const greeting = await frame.$eval('#editBtn', (hello) => {return hello.innerText});
        // expect(greeting).toBe('Hello ' + newUser.username + '!');

        await expect(frame).toClick('span', {text: 'ADD'});

        // const span = await frame.$x("//span[contains(text(), 'ADD')]");
        // if (span.length > 0) {
        //     await span[0].click();
        // } else {
        //     throw new Error("Link not found");
        // }
        


    }, 20000);

    // it('Test 1: nav bar showing right user name', async() => {
    //     await page.waitForSelector("iframe");
    //     const elementHandle = await page.$('#nav-frame');
    //     const frame = await elementHandle.contentFrame();
    //     await frame.waitForSelector('#greeting');
    //     const greeting = await frame.$eval('#greeting', (hello) => {return hello.innerText});
    //     expect(greeting).toBe('Hello ' + newUser.username + '!');
    //   })




    afterAll(async () => {
        browser.close();
    });

   

});