const { crawlPage } = require('./crawl.js');
const { printReport } = require('./report.js');

const main = async () => {
    if (process.argv.length < 3) {
        console.log("No website URL provided.");
        process.exit(1);
    }
    if (process.argv.length > 3) {
        console.log("Too many arguments.");
        process.exit(1);
    }
    const baseURL = process.argv[2];
    console.log(`Start crawling of ${baseURL}...`)
    const pages = await crawlPage(baseURL, baseURL, {});
    printReport(pages);
}

main();
