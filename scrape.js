const puppeteer = require("puppeteer");

const URL = "https://www.oneindia.com/vegetables-price.html";

async function scrapeCropPrices() {
    const browser = await puppeteer.launch({ headless: false, slowMo: 50 }); // Debugging enabled
    const page = await browser.newPage();

    try {
        await page.goto(URL, { waitUntil: "networkidle2", timeout: 60000 });

        // Extract crop buttons
        const cropLinks = await page.evaluate(() => {
            const baseUrl = "https://www.oneindia.com";
            return Array.from(document.querySelectorAll("a"))
                .map(link => {
                    const cropName = link.querySelector("p")?.innerText.trim() || "N/A";
                    const cropUrl = link.getAttribute("href");
                    return { name: cropName, url: cropUrl ? new URL(cropUrl, baseUrl).href : null };
                })
                .filter(item => item.name !== "N/A" && item.url);
        });

        console.log("✅ Found Crop Links:", cropLinks);

        // Loop through each crop link and scrape data
        const allCropPrices = [];

        for (const crop of cropLinks) {
            console.log(`🌐 Navigating to: ${crop.url}`);

            try {
                await page.goto(crop.url, { waitUntil: "networkidle2", timeout: 60000 });

                // ✅ Ensure table exists before scraping
                const tableExists = await page.$("table.table-container tbody");
                if (!tableExists) {
                    console.warn(`⚠️ No table found for ${crop.name}`);
                    continue;
                }

                // ✅ Extracting data from the correct table structure
                const cropPrices = await page.evaluate(() => {
                    const rows = document.querySelectorAll("table.table-container tbody tr"); // Correct selector
                    return Array.from(rows).map(row => {
                        const columns = row.querySelectorAll("td");
                        return {
                            city: columns[0]?.innerText.trim() || "N/A",
                            price: columns[1]?.innerText.trim() || "N/A",
                            quantity: columns[2]?.innerText.trim() || "N/A"
                        };
                    });
                });

                console.log(`📊 Scraped ${crop.name} data:`, cropPrices);
                allCropPrices.push({ crop: crop.name, data: cropPrices });

            } catch (navError) {
                console.error(`❌ Failed to scrape ${crop.name}:`, navError);
            }
        }

        await browser.close();
        console.log("📊 Final Scraped Data:", allCropPrices);
        return allCropPrices;

    } catch (error) {
        console.error("❌ Error scraping crop prices:", error);
        await browser.close();
        return [];
    }
}

// Test Scraper
scrapeCropPrices().then(data => console.log("✅ Done!", data));

module.exports = scrapeCropPrices;
