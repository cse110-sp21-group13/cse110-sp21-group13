describe ('Basic user flow for login page', () => {
    beforeAll(async () => {
        await page.goto('http://127.0.0.1:5500/source/docs/index.html');
        // await page.waitForTimeout(500);
    });

    const user = {
        'username': 'cameron2',
        'password': '12345',
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


    it('test 2: sign up with new user or log in with existing user', async() => {
        await expect(page).toFillForm('form[id=loginform]',{
            username: user.username,
            password: user.password,
        });
        page.click('button', {text: 'sign up'})
        // await expect(page).toClick('button', {text: 'sign up'});
        let error = await page.$eval('#errormsg', (errorMsg) => {return errorMsg.innerText;});
        if(error.length != 0){
            expect(error).toBe('username already taken');
            page.click('button', {text: 'log in'})
            // await expect(page).toClick('button', {text: 'log in'});
            // await page.waitForNavigation({waitUntil: 'networkidle2'});
            expect(page.url().includes('daily.html')).toBe(true);
        };
        //await page.waitForNavigation({waitUntil: 'networkidle2'});
        //expect(page.url().includes('daily.html')).toBe(true);
    }, 100000);


});