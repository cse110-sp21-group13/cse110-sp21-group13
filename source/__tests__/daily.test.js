const { puppeteerErrors } = require("puppeteer");
const puppeteer = require('puppeteer');
let page;
let browser;

describe ('Basic user flow for login page', () => {
    beforeAll(async () => {
        browser = await puppeteer.launch({headless: true, slowMo: 100, testTimeout: 30000,});
        page = await browser.newPage();
        await page.goto('https://journalbullet.herokuapp.com');
    });

    const user = {
        'username': 'dailyE2E',
        'password': '123456',
    };

    it('Test 1: click get started button and get to login', async () => {
        page.click('button', {text: 'get started'})
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

        await page.waitForNavigation({waitUntil: 'networkidle2'});

        await page.waitForSelector("#journal-frame");
        expect(page.url().includes('daily.html')).toBe(true);

        const elementHandle = await page.$('#journal-frame');
        const frame = await elementHandle.contentFrame();
        const titleDate = await frame.$eval("h2", (headers) => headers.innerHTML);
        const date = await page.evaluate(() => {

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
        expect(titleDate).toBe(date);

    }, 20000);

    it('test 3: click add button', async () => {
        const elementHandle = await page.$('#journal-frame');
        const frame = await elementHandle.contentFrame();
        await expect(frame).toClick('span', {text: 'ADD'});
    }, 20000);

    
    it('test 4: check bullet length', async () => {
        const elementHandle = await page.$('#journal-frame');
        const frame = await elementHandle.contentFrame();
        let bulletLength = await frame.evaluate(_ => {
            let bulletL = document.getElementsByTagName("li").length;
            return bulletL;
        });
        await expect(bulletLength).toBe(0);
    }, 20000);

    it('test 5: fill text box and add entry', async () => {
        const elementHandle = await page.$('#journal-frame');
        const frame = await elementHandle.contentFrame();
        await frame.$eval('input[id=myInput]', el => el.value = 'Testing add a bullet');
        await expect(frame).toClick('span', {text: 'ADD'});
    }, 20000);

    it('test 6: check bullet length', async () => {
        const elementHandle = await page.$('#journal-frame');
        const frame = await elementHandle.contentFrame();
        let bulletLength = await frame.evaluate(_ => {
            let bulletL = document.getElementsByTagName("li").length;
            return bulletL;
        });
        await expect(bulletLength).toBe(1);
    }, 20000);

    it('test 7: fill text box and add entry with signifier', async () => {
        const elementHandle = await page.$('#journal-frame');
        const frame = await elementHandle.contentFrame();
        await frame.select('#signifier', '*')
        await frame.$eval('input[id=myInput]', el => el.value = 'Testing add a bullet with signifier');
        await expect(frame).toClick('span', {text: 'ADD'});
    }, 20000);

    it('test 8: check bullet length', async () => {
        const elementHandle = await page.$('#journal-frame');
        const frame = await elementHandle.contentFrame();
        let bulletLength = await frame.evaluate(_ => {
            let bulletL = document.getElementsByTagName("li").length;
            return bulletL;
        });
        await expect(bulletLength).toBe(2);
    }, 20000);

    it('test 9: fill text box and add entry with signifier and bullet type', async () => {
        const elementHandle = await page.$('#journal-frame');
        const frame = await elementHandle.contentFrame();
        await frame.select('#signifier', '!')
        await frame.select('#bullet-type', '-')
        await frame.$eval('input[id=myInput]', el => el.value = 'Testing add a bullet with signifier and bullet type');
        await expect(frame).toClick('span', {text: 'ADD'});
    }, 20000);

    it('test 10: check bullet length', async () => {
        const elementHandle = await page.$('#journal-frame');
        const frame = await elementHandle.contentFrame();
        let bulletLength = await frame.evaluate(_ => {
            let bulletL = document.getElementsByTagName("li").length;
            return bulletL;
        });
        await expect(bulletLength).toBe(3);
    }, 20000);

    it('test 11: add sub-bullet', async () => {
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

    }, 20000);

    it('test 12: check bullet length', async () => {
        const elementHandle = await page.$('#journal-frame');
        const frame = await elementHandle.contentFrame();
        let bulletLength = await frame.evaluate(_ => {
            let bulletL = document.getElementsByTagName("li").length;
            return bulletL;
        });
        await expect(bulletLength).toBe(4);
    }, 20000);


    it('test 13: delete bullet', async () => {
        const elementHandle = await page.$('#journal-frame');
        const frame = await elementHandle.contentFrame();
  
        await frame.evaluate(_ => {
            // this will be executed within the page, that was loaded before
            const deleteButton = document.getElementsByClassName('sub-bullet-button')[0];
            deleteButton.hidden = false;
        });
        await expect(frame).toClick('button', {text: '-'});

    }, 20000);

  
    it('test 14: click prev button to see previous days bullets', async () => {
        let elementHandle = await page.$('#journal-frame');
        let frame = await elementHandle.contentFrame();
        let previousBtn = await page.$('.previousBtn');
        await previousBtn.click();
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

          elementHandle = await page.$('#journal-frame');
          frame = await elementHandle.contentFrame();

          const titleDate = await frame.$eval("h2", (headers) => headers.innerHTML);
          await expect(titleDate).toBe(dateYesterday);
        

    }, 20000);


    it('test 15: click next', async () => {
        let elementHandle = await page.$('#journal-frame');
        let frame = await elementHandle.contentFrame();
        let previousBtn = await page.$('.nextBtn');
        await previousBtn.click();
        await page.waitForNavigation({waitUntil: 'networkidle2'});

        const date = await page.evaluate(() => {
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
        elementHandle = await page.$('#journal-frame');
        frame = await elementHandle.contentFrame();

        const titleDate = await frame.$eval("h2", (headers) => headers.innerHTML);
        expect(titleDate).toBe(date);
    }, 20000);

    
    it('test 16: refresh page', async () => {
        await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
        
    }, 20000);

    it('test 17: check bullet length', async () => {
        await page.waitForSelector("iframe");
        const elementHandle = await page.$('#journal-frame');

        const frame = await elementHandle.contentFrame();
        let bulletLength = await frame.evaluate(_ => {
            let bulletL = document.getElementsByTagName("li").length;
            return bulletL;
        });
        await expect(bulletLength).toBe(2);
    }, 20000);

    // Last test
    it('Test 18: delete user', async () => {
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
