const cron = require('node-cron');
require('dotenv').config();
const { takeScreenShot } = require('./screenshot');
const { scrapCountryInfo } = require('./scrap');


// screenshot
// const url = 'https://vite.dev/';
// const outputPath = 'screenshot.png';
// takeScreenShot (url, outputPath);


// scraping
let urlToScrap = 'https://www.scrapethissite.com/pages/simple/';

cron.schedule('*/1 * * * *', () => {
    console.log('Running Scrap Job.....');
    scrapCountryInfo(urlToScrap);
})

