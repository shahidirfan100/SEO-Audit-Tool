import microdataParser from 'microdata-node';
import { log } from '@apify/sdk';

const jsonLdLookup = async (page) => {
    // const url = page.url();
    // console.time(`${url} jsonLdLookup`);
    let isJsonLd = false;
    let jsonLdData = {};
    if (await page.$('script[type="application/ld+json"]')) {
        try {
            isJsonLd = true;
            jsonLdData = await page.$eval('script[type="application/ld+json"]', (el) => JSON.parse(el.innerText));
        } catch (e) {
            log.warning(`Parsing LD+JSON failed: ${e.message}`);
        }
    }
    // console.timeEnd(`${url} jsonLdLookup`);
    return { isJsonLd, jsonLdData };
};

const microdataLookup = async (page) => {
    // const url = page.url();
    // console.time(`${url} microdataLookup`);
    let isMicrodata = false;
    const pageHtml = await page.evaluate(() => document.documentElement.outerHTML);
    const microdata = microdataParser.toJsonld(pageHtml, {});
    if (microdata.length) isMicrodata = true;

    // console.timeEnd(`${url} microdataLookup`);
    return { isMicrodata, microdata };
};

module.exports = {
    microdataLookup,
    jsonLdLookup,
};
