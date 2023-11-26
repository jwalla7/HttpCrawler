const { JSDOM } = require("jsdom");

async function crawlPage(baseURL, currentURL, pages) {
	const baseURLObject = new URL(baseURL);
	const currentURLObject = new URL(currentURL);
	// Base Cases
	if (baseURLObject.hostname !== currentURLObject.hostname) {
		// console.log(`Skipping ${currentURL} because it is not on the same domain as ${baseURL}`);
		return pages;
	}
	const normalizedCurrentURL = normalizeURL(currentURL);
	if (pages[normalizedCurrentURL] > 0) {
		pages[normalizedCurrentURL]++;
		return pages;
	}

	pages[normalizedCurrentURL] = 1;

	console.log(`Crawling ${currentURL}...`);

	try {
		const res = await fetch(currentURL)
		
		if (res.status > 399) {
			console.log(`HTTP error! status: ${res.status} on page ${currentURL}`);
			return pages;
		}
		if (!res.ok) { throw new Error(`HTTP error! status: ${res.status}`); }
		
		const contentType = res.headers.get("content-type");
		if (!contentType.includes("text/html")) {
			console.log(`Non html response, content type: ${contentType}, on page ${currentURL}`);
			return pages;
		}
		const htmlBody = await res.text();
		const nextURLs = getURLsFromHTML(htmlBody, baseURL);
		
		for (const nextURL of nextURLs) {
			pages = await crawlPage(baseURL, nextURL, pages);
		}
	} catch (error) {
		console.log(error.message);
	}
	return pages;
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