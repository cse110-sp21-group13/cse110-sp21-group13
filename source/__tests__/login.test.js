describe ('Basic user flow for login page', () => {
    beforeAll(async () => {
        await page.goto('https://journalbullet.herokuapp.com');
        await page.waitForTimeout(500);
    });

    it('Test 1: landing page title and welcome', async () => {
        let title = await page.$eval('title', (header) =>{return header.innerHTML;});
        let welcome = await page.$eval('main h1', (ele) =>{return ele.textContent;});
        expect(welcome).toBe('Welcome to your new journal!');
        expect(title).toBe('13ullet');
    });
    it('Test 2: landing page reason statement', async () => {
        let reason = await page.$eval('main h1+h2', (ele1) => {return ele1.textContent;});
        let reason2 = await page.$eval('main h2+h2', (ele3) => {return ele3.textContent;});
        expect(reason2).toBe('Stay productive online');
        expect(reason).toBe('Reduce paper waste');
    });
    it('Test 3: landing page logo', async() => {
        let source = await page.$eval('img', (image) => {return image.src;});
        let altText = await page.$eval('img', (image) =>{return image.alt;});
        expect(source.includes('assets/images/logo.svg')).toBe(true);
        expect(altText).toBe('a smiling black cat');
    });
    it('Test 4: click get started button and get to login', async () => {
        await expect(page).toClick('button', {text: 'get started'});
        let name = await page.$eval('#loginform > label', (username) => {return username.textContent;});
        let password = await page.$eval('#loginform input+label', (key) => {return key.textContent;});
        expect(name).toBe('Name');
        expect(password).toBe('Password');
    }, 20000);

    const newUser = {
        'username': 'test',
        'password': '12345',
    };
    it('Test 5: log in with an existing user', async() => {
        await expect(page).toFillForm('form[id=loginform]',{
            username: newUser.username,
            password: newUser.password,
        });
        await expect(page).toClick('button', {text: 'log in'});
        
        /*await page.waitForNavigation
        await page.waitForSelector();

        let nextBtn = page.$eval('nextBtn', (button) =>{ return button.innerHTML;});
        expect(nextBtn).toBe('NEXT');*/
        //need to learn how to track newly opened page.
    },60000);

    /*it("Test 6: cannot sign up with an existing user", async () => {
        await expect(page).toClick('button', {text: 'sign up'});
        let error = await page.$eval('#errormsg', (errorMsg) => {return errorMsg.innerHTML;});
        expect(error).toBe('');
    }, 30000);*/
    

});
