// scrap.js
const axios = require("axios");
const cheerio = require("cheerio");
const pool = require("./dbConfig");

async function scrapeWebsite(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const websiteName = $("title").text();
    const topPageURL = url;

    return { websiteName, topPageURL };
  } catch (error) {
    console.error("Error scraping website:", error);
    throw error;
  }
}

async function saveToDatabase(data) {
  try {
    const query = `
      INSERT INTO websites (name, top_page)
      VALUES ($1, $2)
    `;

    await pool.query(query, [data.websiteName, data.topPageURL]);

    console.log("Data inserted into the database successfully.");
  } catch (error) {
    console.error("Error inserting data into the database:", error);
    throw error;
  }
}

async function main() {
  const websiteUrls = [
    "http://quotes.toscrape.com",
    "https://news.ycombinator.com",
  ];

  for (const url of websiteUrls) {
    try {
      const data = await scrapeWebsite(url);
      await saveToDatabase(data);
    } catch (error) {
      console.error(`Error processing ${url}:`, error);
    }
  }
}

main();
