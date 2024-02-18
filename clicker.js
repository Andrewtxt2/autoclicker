const { Builder, By, Key, until } = require('selenium-webdriver');

async function startClicker() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get('https://app.lokalise.com/project/72668953629f860f32f7d3.34538230/?view=multi&filter=builtin_1');
        await driver.manage().window().maximize();

        // Accept cookies
        let buttonCookie = await driver.findElement(By.xpath('//*[@id="onetrust-accept-btn-handler"]'));
        await buttonCookie.click();

        // Log in
        let emailInput = await driver.findElement(By.xpath('//*[@id="email"]'));
        let passwordInput = await driver.findElement(By.xpath('//*[@id="wrap"]/login-page/div/div[2]/div[2]/form/div[2]/div/input'));

        await emailInput.sendKeys('andrii.m@dreamapp.io');
        await passwordInput.sendKeys('Ufiraf04_', Key.RETURN);
        await driver.sleep(1000);

        // Wait for the page to load after login
        await driver.wait(until.urlContains('project'), 5000);

        // Wait for all elements to load
        await driver.sleep(5000);

        let lastCount = 0;
        let currentCount = 0;

        do {
            lastCount = currentCount;
            await driver.executeScript("window.scrollTo(0, document.body.scrollHeight)");
            let blocksToHover = await driver.findElements(By.className('break-word'));

            for (let block of blocksToHover) {
                try {
                    // Scroll to the block
                    await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center', inline: 'nearest'});", block);
                    await driver.sleep(500); // Почекайте трохи після прокрутки, щоб елемент був повністю завантажений

                    // Перевірка, чи є блок видимим
                    if (await block.isDisplayed()) {
                        // Hover over the block
                        await driver.actions().move({origin: block}).perform();

                        // Click on the visible element
                        let visibleElement = await block.findElement(By.className('key-function-button machine-all fontello-google-circle'));
                        await driver.actions().click(visibleElement).perform();

                        currentCount++;

                        // Додайте додаткову затримку після кліку
                        await driver.sleep(500);
                    } else {
                        console.log('Елемент не видно');
                    }
                } catch (error) {
                    console.error('Помилка:', error);
                }
            }


        } while (currentCount > lastCount);

        console.log("Total blocks hovered: " + currentCount);

    } finally {

    }
}

startClicker();
