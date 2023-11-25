const { normalizeURL, getURLsFromHTML } = require("./crawl.js");
const { test, expect } = require("@jest/globals");

test("normalizeURL strip protocol", () => {
	const input = "https://blog.boot.dev/path"
	const actual = normalizeURL(input)
	const expected = "blog.boot.dev/path"
	expect(actual).toEqual(expected)
})

test("normalizeURL strip trailing slashes", () => {
	const input = "https://blog.boot.dev/path/"
	const actual = normalizeURL(input)
	const expected = "blog.boot.dev/path"
	expect(actual).toEqual(expected)
})

test("normalizeURL capitals", () => {
	const input = "http://BLOG.boot.dev/path/"
	const actual = normalizeURL(input)
	const expected = "blog.boot.dev/path"
	expect(actual).toEqual(expected)
})

test("normalizeURL http", () => {
	const input = "http://blog.boot.dev/path/"
	const actual = normalizeURL(input)
	const expected = "blog.boot.dev/path"
	expect(actual).toEqual(expected)
})

test("getURLsFromHTML absolute", () => {
	const input = `
	<html>
		<body>
			<a href="https://blog.boot.dev/path/">
				Boot.dev Blog
			</a>
		</body>
	</html>
	`
	const inputBaseURL = "https://blog.boot.dev/path/"
	const actual = getURLsFromHTML(input, inputBaseURL)
	const expected = ["https://blog.boot.dev/path/"]
	expect(actual).toEqual(expected)
})

test("getURLsFromHTML relative", () => {
	const inputHTMLBody = `
	<html>
		<body>
			<a href="/path/">
				Boot.dev Blog
			</a>
		</body>
	</html>
	`
	const inputBaseURL = "https://blog.boot.dev"
	const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
	const expected = ["https://blog.boot.dev/path/"]
	expect(actual).toEqual(expected)
})

test("getURLsFromHTML both absolute/relative", () => {
	const inputHTMLBody = `
	<html>
		<body>
			<a href="/path/1">
				Boot.dev Blogs
			</a>
			<a href="/path/2">
				Boot.dev Blog
			</a>
		</body>
	</html>
	`
	const inputBaseURL = "https://blog.boot.dev"
	const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
	const expected = ["https://blog.boot.dev/path/1", "https://blog.boot.dev/path/2"]
	expect(actual).toEqual(expected)
})

test("getURLsFromHTML invaild", () => {
	const inputHTMLBody = `
	<html>
		<body>s
			<a href="invalid">
				Invaild
			</a>
		</body>
	</html>
	`
	const inputBaseURL = "Invalid"
	const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
	const expected = []
	expect(actual).toEqual(expected)
})