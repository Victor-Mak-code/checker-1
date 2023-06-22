const express = require("express");
let chrome = {};
let puppeteer;
const app = express()
const PORT = process.env.PORT || 3000;

if(process.env.AWS_LAMBDA_FUNCTION_VERSION){
    chrome = require("chrome-aws-lambda");
    puppeteer = require("puppeteer-core");
}
else {
  puppeteer = require("puppeteer");
}

app.get("/", (req, res) => {
   res.send("Hello Server.js")
});

app.get("/checker", async(req, res) => {
  let options = {};

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    options = {
      args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    };
  }

    try {
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    await page.goto('https://dashboard.stripe.com/login');
    await page.locator("#email").fill("test@mails.com")
    await page.locator("#old-password").fill("tesjhjashjhajsasjk")
    await page.locator('body > div.db-Login-root.db-Login-root--v4 > div > div > div.db-RegisterAndLoginLayout.db-RegisterAndLoginLayout--login.db-RegisterAndLoginLayout--isMobile.Box-root.Flex-flex.Flex-direction--column > div.db-RegisterAndLoginLayout-contentWrapper.Box-root > div > div.Card-root.Card--radius--all.Card--shadow--large.db-RegisterAndLoginLayout-card.Box-root.Box-hideIfEmpty.Box-background--white > div > div > div > div > div > div > div:nth-child(2) > form > div > div > div > div:nth-child(4) > div > div > div > div > div > div.PressableCore-base.Box-root > button').click()
    await page.waitForSelector('.Text-color--red', {timeout: 3000}).then(() => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({msg: 'Incorrect email or password'}));
    }).catch(() => {
    res.send(JSON.stringify({msg: 'Success'}))
    })
    await page.close();
    } catch (error) {
        console.error(error);
        return null;
    }
 
})();

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`)
})
