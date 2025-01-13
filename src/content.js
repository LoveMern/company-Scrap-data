let profileData = {};

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function injectScript(scriptPath, functionName) {
    const src = chrome.runtime.getURL(`src/components/${scriptPath}`);
    const module = await import(src);

    if (typeof module[functionName] === "function") {
        await module[functionName](profileData);
    } else {
        console.warn(`Function ${functionName} not found in ${scriptPath}`);
    }
}

async function scrapeProfile(tabId) {
    console.log("Starting profile scrape for tabId:", tabId);
    await injectScript("basicDetails/BasicDetails.js", "extractBasicDetails");
    await injectScript("aboutDetails/AboutDetails.js", "AboutDetailsCollection");


    console.log("All scripts executed in sequence.");
    chrome.runtime.sendMessage({ message: "SCRAPE_COMPLETE" });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === "START_SCRAPE") {
        const tabId = sender;
        console.log(tabId, "tabId")
        scrapeProfile(tabId);
        sendResponse({ status: "Scraping started" });
        return true;
    }
});