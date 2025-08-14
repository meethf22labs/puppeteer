require("dotenv").config();
const puppeteer = require("puppeteer");
const { Client } = require("pg");

const db = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect();

const scrapCountryInfo = async (urlToScrap) => {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(urlToScrap, { waitUntil: "networkidle2" });

        // scrapping
        console.log('Scrapping Started....');
        const scrapedCountries = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.country'))
                .map((el) => ({
                    scrappedName: el.querySelector('.country-name')?.textContent.trim() || '',
                    scrappedCapital: el.querySelector('.country-capital')?.textContent.trim() || '',
                    scrappedPopulation: el.querySelector('.country-population')?.textContent.trim() || null,
                    scrappedArea: el.querySelector('.country-area')?.textContent.trim() || null
                }));
        });
        console.log('Scrapped Countries Information:', scrapedCountries);

        // storing in the db with UPSERT
        console.log('Storing in db');
        for (const c of scrapedCountries) {
            await db.query(
                `INSERT INTO countries (name, capital, population, area, scraped_at)
                 VALUES ($1, $2, $3, $4, NOW())
                 ON CONFLICT (name) 
                 DO UPDATE SET 
                    capital = EXCLUDED.capital,
                    population = EXCLUDED.population,
                    area = EXCLUDED.area,
                    scraped_at = NOW()`,
                [
                    c.scrappedName,
                    c.scrappedCapital,
                    c.scrappedPopulation,
                    c.scrappedArea
                ]
            );
        }
        console.log('Data stored/updated in DB');
        console.log('Scrapping Ended.');
    } catch (error) {
        console.log(`Error while scraping data from the Website: ${error}`);
    }
};

module.exports = { scrapCountryInfo };
