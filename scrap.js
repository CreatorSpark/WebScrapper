const axios = require("axios");
const cheerio = require("cheerio");
const pool = require("./dbConfig");

async function scrapeWebsite(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Extract the data you want from the website using Cheerio selectors
    // For example, if you want to get the website name and top page URL:
    const websiteName = $("title").text();
    const topPageURL = url;

    return { websiteName, topPageURL };
  } catch (error) {
    console.error("Error scraping website:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
}

async function saveToDatabase(data) {
  try {
    const query = `
      INSERT INTO websites (name, top_page)
      VALUES ($1, $2)
    `;

    // Use a connection from the pool to execute the query
    await pool.query(query, [data.websiteName, data.topPageURL]);

    console.log("Data inserted into the database successfully.");
  } catch (error) {
    console.error("Error inserting data into the database:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
}

async function main() {
  const websiteUrls = [
    "http://quotes.toscrape.com",
    "https://news.ycombinator.com",
    // Add more URLs as needed
  ];

  for (const url of websiteUrls) {
    try {
      // Scrape the website
      const data = await scrapeWebsite(url);

      // Save the scraped data to the database
      await saveToDatabase(data);
    } catch (error) {
      // Handle errors for individual websites if needed
      console.error(`Error processing ${url}:`, error);
    }
  }

  // All websites have been scraped and data stored in the database.
  // Perform any other cleanup or closing operations here.
}

main();
