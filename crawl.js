const { JSDOM } = require("jsdom");


async function crawlPage(currentURL) {
	console.log(`Crawling ${currentURL}...`);
	const res = await fetch(currentURL)
	console.log(`response HTML: ${ await res.text()}`);
}


function getURLsFromHTML(htmlBody, baseURL) {
	const urls = [];
	const dom = new JSDOM(htmlBody);
	const linkElements = dom.window.document.querySelectorAll("a");
	for (const linkElement of linkElements) {
		if (linkElement.href.slice(0, 1) === "/") {
			// relative URL
			try {
				const urlObject = new URL(`${baseURL}${linkElement.href}`);
				urls.push(urlObject.href);
			} catch (error) {
				console.log(error.message);
			}
		} else {
			// absolute URL
			try {
				const urlObject = new URL(linkElement.href);
				urls.push(urlObject.href);
			} catch (error) {
				console.log(error.message);
			}
		}
	}
	return urls;
}

function normalizeURL(urlString) {
	const urlObject = new URL(urlString);
	const hostPath = `${urlObject.hostname}${urlObject.pathname}`;
	if (hostPath.length > 0 && hostPath.slice(-1) === "/") {
		return hostPath.slice(0, -1);
	}
	return hostPath;
}

module.exports = {
	normalizeURL,
	getURLsFromHTML,
	crawlPage,
}