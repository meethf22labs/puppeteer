const puppeteer = require("puppeteer");
//console.log(puppeteer)

const takeScreenShot = async(url, outputPath) => {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "networkidle2" });
        await page.screenshot({ path: outputPath, fullPage: true });
    
        console.log(`screenshot saved to the path: ${outputPath}`);
        await browser.close();
    } catch (error) {
        console.log('Error while taking screen shot :', error);
    }
}


const url = 'https://vite.dev/';
const outputPath = 'screenshot.png';

takeScreenShot(url, outputPath)