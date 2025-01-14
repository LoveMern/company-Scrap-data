

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "createTabAndExtractData") {
        chrome.tabs.create({ url: message.url, active: true }, (tab) => {
            chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
                if (tabId === tab.id && changeInfo.status === "complete") {
                    chrome.tabs.onUpdated.removeListener(listener);
                    chrome.scripting.executeScript(
                        {
                            target: { tabId: tab.id },
                            func: extractPageData,
                        },
                        (injectionResults) => {
                            if (injectionResults && injectionResults[0]?.result) {
                                sendResponse(injectionResults[0].result);
                                chrome.tabs.remove(tab.id);
                            } else {
                                console.error("Failed to get extraction results");
                                sendResponse(null);
                            }
                        }
                    );
                }
            });
        });
        return true;
    }
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "navigate") {
        chrome.tabs.update(sender.tab.id, { active: true }, () => {
            if (chrome.runtime.lastError) {
                sendResponse({
                    success: false,
                    error: chrome.runtime.lastError.message,
                });
            } else {
                sendResponse({
                    success: true,
                    message: "Switched back to the original tab.",
                });
            }
        });
        return true;
    }
});


async function extractPageData() {
    try {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const MainContent = document.querySelector("div.scaffold-layout__content--main-aside");

        if (!MainContent) {
            console.error("Main content not found");
            return { title: "", date: "", description: "", images: [], link: "" };
        }

        const header = MainContent.querySelector("header.pt4");
        if (!header) {
            console.error("Header section not found");
            return { title: "", date: "", description: "", images: [], link: "" };
        }

        const mainImage = header.querySelector("img.reader-cover-image__img")
            ? header.querySelector("img.reader-cover-image__img").getAttribute("src")
            : "";

        const title = header.querySelector("h1.reader-article-header__title span")
            ? header.querySelector("h1.reader-article-header__title span").innerText.trim()
            : "";

        const section = MainContent.querySelector("div.reader__grid");
        if (!section) {
            return { title: "", date: "", description: "", images: [], link: "" };
        }

        const articleContent = section.querySelector("div.reader-article-content");
        if (!articleContent) {
            return { title: "", date: "", description: "", images: [], link: "" };
        }

        const description = [];
        Array.from(articleContent.querySelectorAll('p, span, li')).forEach(el => {
            const text = el.innerText.trim();
            if (text) {
                description.push(text);
            }
        });

        const dateString = MainContent.querySelector('time')
            ? MainContent.querySelector('time').innerText.trim()
            : "";

        if (!dateString) {
            console.error("Date not found");
            return false
        }

        const articleDate = new Date(dateString);

        const currentDate = new Date();
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

        if (articleDate < threeMonthsAgo) {
            console.log("Article is older than 3 months");
            return { title: "", date: "", description: "", images: [], link: "" };
        }

        const images = Array.from(articleContent.querySelectorAll('img'))
            .map(img => img.src)
            .filter(src => src);

        if (mainImage) {
            images.unshift(mainImage);
        }
        const link = window.location.href;
        const fullDescription = description.join(' ');
        return {
            title,
            date: dateString,
            description: fullDescription,
            images,
            link,
        };
    } catch (error) {
        console.error("Error extracting page data:", error);
        return { title: "", date: "", description: "", images: [], link: "" };
    }
}






chrome.commands.onCommand.addListener((command) => {
    if (command === "openFeature") {
        console.log("Shortcut triggered!");
        // Add your functionality here
    }
});
