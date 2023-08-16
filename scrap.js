// scrap.js
const axios = require("axios");
const cheerio = require("cheerio");
const pool = require("./dbConfig");

async function scrapeWebsite(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Find the elements containing the course information
    const courseElements = $("div.course-item");

    // Create an array to store the course data
    const courses = [];

    // Loop through each course element and extract the relevant data
    courseElements.each((index, element) => {
      const courseName = $(element).find("h3").text();
      const coursePrice = $(element).find("div.course-price").text();

      // Push the course data into the courses array
      courses.push({ courseName, coursePrice });
    });

    return courses;
  } catch (error) {
    console.error("Error scraping website:", error);
    throw error;
  }
}

async function saveToDatabase(courses) {
  try {
    const query = `
      INSERT INTO courses (name, price)
      VALUES ($1, $2)
    `;

    for (const course of courses) {
      console.log("Course Name:", course.courseName);
      console.log("Course Price:", course.coursePrice);

      await pool.query(query, [course.courseName, course.coursePrice]);
    }

    console.log("Data inserted into the database successfully.");
  } catch (error) {
    console.error("Error inserting data into the database:", error);
    throw error;
  }
}

async function main() {
  const websiteUrl = "https://utscollege.edu.au/au/how-to-apply/program-fees";

  try {
    // Scrape the website and get the courses
    const courses = await scrapeWebsite(websiteUrl);

    // Save the courses to the database
    await saveToDatabase(courses);
  } catch (error) {
    console.error("Error processing:", error);
  }
}

main();
