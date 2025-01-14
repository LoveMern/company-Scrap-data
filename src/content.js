let profileData = {};

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function injectScript(scriptPath, functionName, environment, numPosts, numJobs) {
    const src = chrome.runtime.getURL(`src/components/${scriptPath}`);
    const module = await import(src);

    if (typeof module[functionName] === "function") {
        await module[functionName](profileData, environment, numPosts, numJobs);
    } else {
        console.warn(`Function ${functionName} not found in ${scriptPath}`);
    }
}

async function scrapeProfile(tabId, environment, numPosts, numJobs) {
    // console.log("Environment:", environment);
    console.log("Number of Posts:", numPosts);
    console.log("Number of Jobs:", numJobs);
    await injectScript("basicDetails/BasicDetails.js", "extractBasicDetails");
    await injectScript("aboutDetails/AboutDetails.js", "AboutDetailsCollection");
    await injectScript("postsArticalDetails/PostArticalDetail.js", "PostArticalDetails" , numPosts)
    console.log("All scripts executed in sequence.");
    chrome.runtime.sendMessage({ message: "SCRAPE_COMPLETE" });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === "START_SCRAPE") {
        const tabId = sender
        const environment = request.environment;
        const numPosts = request.numPosts;
        const numJobs = request.numJobs;
        scrapeProfile(tabId, environment, numPosts, numJobs);
        sendResponse({ status: "Scraping started" });
        return true;
    }
});