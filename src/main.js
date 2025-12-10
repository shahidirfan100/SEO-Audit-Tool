import { Actor, log, enqueueLinks, PseudoUrl, createProxyConfiguration, openRequestQueue, PuppeteerCrawler, Dataset } from '@apify/sdk';

import { basicSEO } from './seo.js';
import { jsonLdLookup, microdataLookup } from './ontology_lookups.js';

Actor.main(async () => {
    const input = await Actor.getInput();
    const {
        startUrl,
        proxy,
        maxRequestsPerCrawl,
        maxDepth,
        seoParams,
        userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36',
        viewPortWidth,
        viewPortHeight,
        pageTimeout,
        maxRequestRetries,
        handlePageTimeoutSecs = 3600,
    } = input;

    log.info(`SEO audit for ${startUrl} started`);

    // Get web hostname
    const { hostname } = new URL(startUrl);
    const pseudoUrl = new PseudoUrl(`[http|https]://[.*]${hostname}[.*]`);

    log.info(`Web host name: ${hostname}`);

    const proxyConfiguration = await createProxyConfiguration({
        ...proxy,
    }) || undefined;

    const requestQueue = await openRequestQueue();
    await requestQueue.addRequest({ url: startUrl });

    const dataset = await Dataset.open();

    const crawler = new PuppeteerCrawler({
        requestQueue,
        proxyConfiguration,
        useSessionPool: true,
        gotoFunction: async ({ request, page }) => {
            await page.setBypassCSP(true);

            if (userAgent) {
                await page.setUserAgent(userAgent);
            }

            if (viewPortWidth && viewPortHeight) {
                await page.setViewport({
                    height: viewPortHeight,
                    width: viewPortWidth,
                });
            }

            return page.goto(request.url, {
                waitUntil: 'networkidle2',
                timeout: pageTimeout,
            });
        },
        launchPuppeteerOptions: {
            ignoreHTTPSErrors: true,
            args: [
                // needed for CSP to be actually bypassed, and fetch work inside the browser
                '--allow-running-insecure-content',
                '--disable-web-security',
                '--enable-features=NetworkService',
                '--ignore-certificate-errors',
            ],
        },
        maxRequestRetries,
        maxRequestsPerCrawl,
        handlePageTimeoutSecs,
        handlePageFunction: async ({ request, page }) => {
            log.info('Start processing', { url: request.url });

            const data = {
                url: page.url(),
                title: await page.title(),
                isLoaded: true,
                ...await basicSEO(page, seoParams),
                jsonLd: await jsonLdLookup(page),
                microdata: await microdataLookup(page),
            };

            await dataset.pushData(data);

            // Enqueue links, support SPAs
            const enqueueResults = await enqueueLinks({
                page,
                selector: 'a[href]:not([target="_blank"]),a[href]:not([rel*="nofollow"]),a[href]:not([rel*="noreferrer"])', // exclude externals
                pseudoUrls: [pseudoUrl],
                requestQueue,
                transformRequestFunction: (r) => {
                    const url = new URL(r.url);
                    url.pathname = url.pathname
                        .split('/')
                        .filter(s => s)
                        .slice(0, maxDepth)
                        .join('/');

                    return {
                        url: url.toString(),
                    };
                },
            });

            const newRequests = enqueueResults.filter((result) => (!result.wasAlreadyPresent));

            if (newRequests.length) {
                log.info(`${request.url}: Added ${newRequests.length} urls to queue.`);
            }

            log.info(`${request.url}: Finished`);
        },

        handleFailedRequestFunction: async ({ request, error }) => {
            log.info(`Request ${request.url} failed too many times`);

            await dataset.pushData({
                url: request.url,
                isLoaded: false,
                errorMessage: error.message,
            });
        },
    });

    await crawler.run();

    log.info(`SEO audit for ${startUrl} finished.`);
});
