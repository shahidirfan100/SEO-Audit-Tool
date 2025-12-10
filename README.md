# SEO Audit Tool

## Description

The SEO Audit Tool is a powerful web crawler designed to perform comprehensive SEO audits on websites. It scans all pages of a given website, identifies potential SEO issues, and provides detailed reports to help improve search engine optimization performance. This tool is ideal for webmasters, SEO specialists, and digital marketers looking to enhance their site's visibility and ranking on search engines.

## Features

- **Comprehensive Crawling**: Crawls all web pages on your website to ensure thorough analysis.
- **SEO Issue Detection**: Identifies errors and issues that could negatively impact SEO, such as missing meta tags, broken links, unoptimized images, and more.
- **Detailed Reporting**: Generates structured reports with actionable insights for each page.
- **Performance Checks**: Evaluates page load status, content length, link counts, and other critical SEO factors.
- **Structured Data Analysis**: Checks for JSON-LD and microdata implementations.
- **Mobile-Friendly Assessment**: Verifies viewport settings and AMP compatibility.

## Input

The tool requires the following input parameters:

- **startUrls**: An array of URLs where the crawling should begin. This is the primary input for specifying the website to audit.
- **maxPagesToCrawl**: (Optional) The maximum number of pages to crawl. Default is unlimited if not specified.
- **maxCrawlDepth**: (Optional) The maximum depth for crawling links from the start URLs.

### Example Input Configuration

```json
{
  "startUrls": [
    { "url": "https://example.com" }
  ],
  "maxPagesToCrawl": 100,
  "maxCrawlDepth": 5
}
```

## Output

The results are stored in Apify datasets. Each dataset item represents an audited page and includes the following fields:

- `url`: The URL of the audited page.
- `title`: The title of the page.
- `isLoaded`: Boolean indicating if the page loaded successfully.
- `isGoogleAnalyticsObject`: Checks for Google Analytics object presence.
- `isGoogleAnalyticsFunc`: Checks for Google Analytics function presence.
- `isCharacterEncode`: Verifies meta charset tag.
- `isMetaDescription`: Checks for meta description.
- `metaDescription`: The content of the meta description.
- `isMetaDescriptionEnoughLong`: Boolean for sufficient meta description length.
- `isDoctype`: Checks for DOCTYPE declaration.
- `isTitle`: Checks for title element.
- `isTitleEnoughLong`: Boolean for sufficient title length.
- `isH1`: Checks for H1 element presence.
- `h1`: The content of the H1 element.
- `isH1OnlyOne`: Ensures only one H1 per page.
- `isH2`: Checks for H2 element presence.
- `linksCount`: Total number of links on the page.
- `isTooEnoughLinks`: Boolean for sufficient link count.
- `internalNoFollowLinks`: Array of no-follow internal links.
- `internalNoFollowLinksCount`: Count of no-follow internal links.
- `notOptimizedImages`: Array of images without alt tags.
- `notOptimizedImagesCount`: Count of unoptimized images.
- `wordsCount`: Total word count on the page.
- `isContentEnoughLong`: Boolean for sufficient content length.
- `isViewport`: Checks for viewport meta tag.
- `isAmp`: Checks for AMP implementation.
- `isNotIframe`: Ensures no iframes are present.
- `brokenLinks`: Array of broken links.
- `brokenLinksCount`: Count of broken links.
- `brokenImages`: Array of broken images.
- `brokenImagesCount`: Count of broken images.
- `jsonLd`: Object containing JSON-LD data and presence flag.
- `microdata`: Object containing microdata and presence flag.

## Usage

1. **Set Input Parameters**: Provide the start URLs and optional crawl limits in the input configuration.
2. **Run the Actor**: Execute the SEO Audit Tool on the Apify platform.
3. **Retrieve Results**: Access the generated dataset for detailed audit reports.
4. **Analyze and Act**: Review the findings to identify and fix SEO issues on your website.

### Example Usage

To audit a website, set the `startUrls` to the homepage and run the actor. The tool will automatically crawl linked pages and compile the audit data.

## Configuration

- **Crawling Limits**: Adjust `maxPagesToCrawl` and `maxCrawlDepth` to control the scope of the audit.
- **Custom Settings**: Depending on your needs, you can modify input parameters to focus on specific aspects of SEO.

## Example Result

```json
{
  "url": "https://www.apify.com/",
  "title": "Web Scraping, Data Extraction and Automation - Apify",
  "isLoaded": true,
  "isGoogleAnalyticsObject": true,
  "isGoogleAnalyticsFunc": false,
  "isCharacterEncode": true,
  "isMetaDescription": true,
  "metaDescription": "Apify extracts data from websites, crawls lists of URLs and automates workflows on the web. Turn any website into an API in a few minutes!",
  "isMetaDescriptionEnoughLong": true,
  "isDoctype": true,
  "isTitle": true,
  "isTitleEnoughLong": true,
  "isH1": true,
  "h1": "The web scraping and automation platform",
  "isH1OnlyOne": true,
  "isH2": true,
  "linksCount": 91,
  "isTooEnoughLinks": true,
  "internalNoFollowLinks": [],
  "internalNoFollowLinksCount": 0,
  "notOptimizedImages": [],
  "notOptimizedImagesCount": 0,
  "wordsCount": 1373,
  "isContentEnoughLong": false,
  "isViewport": true,
  "isAmp": true,
  "isNotIframe": false,
  "brokenLinks": [],
  "brokenLinksCount": 0,
  "brokenImages": [],
  "brokenImagesCount": 0,
  "jsonLd": {
    "isJsonLd": false,
    "jsonLdData": {}
  },
  "microdata": {
    "isMicrodata": false,
    "microdata": []
  }
}
```

