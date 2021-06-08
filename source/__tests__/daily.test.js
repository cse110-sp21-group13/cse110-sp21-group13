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
        'username': 'cameron4',
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

        await page.waitForSelector("iframe");
        expect(page.url().includes('daily.html')).toBe(true);

        const elementHandle = await page.$('#journal-frame');
        const frame = await elementHandle.contentFrame();
        const titleDate = await frame.$eval("h2", (headers) => headers.innerHTML);
        const date = await page.evaluate(() => {
            
            // const n = new Date();
            // queryString = 'date='+ n.getFullYear() + '-' +
            //               (n.getMonth() + 1) + '-' + (n.getDate());
            // // journalTypeMonth = queryString.split('-').length === 3;
            // return queryString;

            const monthName = function(dt) {
                mlist = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
                return mlist[dt];
            };
            let n = new Date(params.get('date') + ' 00:00:00');
            n.toLocaleString('default', {month: 'short'});
            let y = n.getFullYear();
            let m = n.getMonth();
            let d = n.getDate();
            const dateHeader = monthName(m) + ' ' + d + ', ' + y;
            return dateHeader;
            
          });
        // const dateNow = new Date();

        //no parameter => mocked current Date returned
        // console.log(dateNow.toISOString()); //outputs: "2020-11-01T00:00:00.000Z"
        expect(titleDate).toBe(date);

    }, 20000);

    
    it('test 3: click add button', async () => {
        // await page.waitForSelector("iframe");
        const elementHandle = await page.$('#journal-frame');
        const frame = await elementHandle.contentFrame();
        await expect(frame).toClick('span', {text: 'ADD'});
    }, 20000);

    it('test 4: fill text box and add entry', async () => {
        // await page.waitForSelector("iframe");
        const elementHandle = await page.$('#journal-frame');
        const frame = await elementHandle.contentFrame();
        await frame.$eval('input[id=myInput]', el => el.value = 'Testing add a bullet');
        await expect(frame).toClick('span', {text: 'ADD'});
    }, 20000);

    it('test 5: fill text box and add entry with signifier', async () => {
        // await page.waitForSelector("iframe");
        const elementHandle = await page.$('#journal-frame');
        const frame = await elementHandle.contentFrame();
        await frame.select('#signifier', '*')
        await frame.$eval('input[id=myInput]', el => el.value = 'Testing add a bullet with signifier');
        await expect(frame).toClick('span', {text: 'ADD'});
    }, 20000);

    it('test 6: fill text box and add entry with signifier and bullet type', async () => {
        // await page.waitForSelector("iframe");
        const elementHandle = await page.$('#journal-frame');
        const frame = await elementHandle.contentFrame();
        await frame.select('#signifier', '*')
        await frame.select('#bullet-type', '-')
        await frame.$eval('input[id=myInput]', el => el.value = 'Testing add a bullet with signifier and bullet type');
        await expect(frame).toClick('span', {text: 'ADD'});
    }, 20000);

    it('test 7: add sub-bullet', async () => {
        const elementHandle = await page.$('#journal-frame');
        const frame = await elementHandle.contentFrame();
  
        await frame.evaluate(_ => {
            // this will be executed within the page, that was loaded before
            const addSubButton = document.getElementsByClassName('sub-bullet-button');
            var i;
            for (i = 0; i < addSubButton.length; i++) {
                addSubButton[i].hidden = false;
            }

            
        });
   
        await expect(frame).toClick('button', {text: '+'});

        await frame.select('#sub-bullet-type', '-')
        await frame.$eval('input[id=mySubInput]', el => el.value = 'Testing add a sub bullet');
        let subAdd = await frame.$('.addSubBtn');
        await subAdd.click();
        // await expect(frame).toClick('span', {class: 'ADD '});

    }, 20000);


    it('test 8: delete bullet', async () => {
        // await page.waitForSelector("iframe");
        const elementHandle = await page.$('#journal-frame');
        const frame = await elementHandle.contentFrame();
  
        await frame.evaluate(_ => {
            // this will be executed within the page, that was loaded before
            const deleteButton = document.getElementsByClassName('sub-bullet-button')[0];
            deleteButton.hidden = false;
        });
        await expect(frame).toClick('button', {text: '-'});

    }, 20000);


    it('test 9: click prev button to see previous days bullets', async () => {
        // await page.waitForSelector("iframe");
        const elementHandle = await page.$('#journal-frame');
        const frame = await elementHandle.contentFrame();

        const titleDate = await frame.$eval("h2", (headers) => headers.innerHTML);

        await expect(page).toClick('span', {class: 'previousBtn'});
        await page.waitForNavigation({waitUntil: 'networkidle2'});

        const dateYesterday = await page.evaluate(() => {

            const monthName = function(dt) {
                mlist = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
                return mlist[dt];
            };
            let n = new Date(params.get('date') + ' 00:00:00');
            const yesterday = new Date(n)
            yesterday.setDate(yesterday.getDate() - 1)


            yesterday.toLocaleString('default', {month: 'short'});
            let y = n.getFullYear();
            let m = n.getMonth();
            let d = n.getDate();
            const dateHeader = monthName(m) + ' ' + d + ', ' + y;

            

            return dateHeader;
            
          });
        
          expect(titleDate).toBe(dateYesterday);
        

    }, 20000);

    it('test 10: click next', async () => {
        // await page.waitForSelector("iframe");
        // const elementHandle = await page.$('#journal-frame');
        // const frame = await elementHandle.contentFrame();
        // await frame.select('#signifier', '*')
        // await frame.$eval('input[id=myInput]', el => el.value = 'test 6: fill text box and add entry with signifier and bullet type');
        // await expect(frame).toClick('span', {text: 'ADD'});
    }, 20000);

    // Migration check
    it('test 11: migration page, select a bullet continue', async () => {
        // await page.waitForSelector("iframe");
        // const elementHandle = await page.$('#journal-frame');
        // const frame = await elementHandle.contentFrame();
        // await frame.select('#signifier', '*')
        // await frame.$eval('input[id=myInput]', el => el.value = 'test 6: fill text box and add entry with signifier and bullet type');
        // await expect(frame).toClick('span', {text: 'ADD'});
    }, 20000);

    // Last test
    it('test 11: press save and refresh', async () => {
        // await page.waitForSelector("iframe");
        // const elementHandle = await page.$('#journal-frame');
        // const frame = await elementHandle.contentFrame();
        // await frame.select('#signifier', '*')
        // await frame.$eval('input[id=myInput]', el => el.value = 'test 6: fill text box and add entry with signifier and bullet type');
        // await expect(frame).toClick('span', {text: 'ADD'});
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