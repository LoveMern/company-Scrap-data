function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}


export async function PostArticalDetails(profileData) {
    await delay(2000);
    await handleListSection();
    await clickArticlesButton();

    async function loadAllSkills() {
        const htmlElement = document.documentElement;
        let hasMoreArticles = true;
        let allArticleData = [];
        let processedLinks = new Set();

        async function smoothScrollDown() {
            let lastScrollTop = htmlElement.scrollTop;

            return new Promise(resolve => {
                let interval = setInterval(() => {
                    htmlElement.scrollBy(0, 200);
                    if (htmlElement.scrollTop === lastScrollTop) {
                        clearInterval(interval);
                        resolve();
                    }
                    lastScrollTop = htmlElement.scrollTop;
                }, 300);
            });
        }

        while (hasMoreArticles) {
            const initialScrollHeight = htmlElement.scrollHeight;
            const loadMoreButton = Array.from(
                document.querySelectorAll('button.artdeco-button--muted')
            ).find(btn => btn.textContent.trim() === "Show more results");

            if (loadMoreButton) {
                loadMoreButton.click();
                console.log('Clicked "Show more results" button');
                await delay(3000);
            } else {
                console.log('No more "Show more results" button found');
                hasMoreArticles = false;
            }

            await smoothScrollDown();
            await delay(3000);

            const articleContainer = document.querySelector("div.feed-container-theme div.scaffold-finite-scroll__content");
            if (!articleContainer) {
                hasMoreArticles = false;
                break;
            }

            const articles = articleContainer.querySelectorAll("article.update-components-article--large-image-content");
            if (articles.length === 0) {
                hasMoreArticles = false;
                break;
            }

            let linksURL = [];

            articles.forEach(article => {
                const articleLink = article.querySelector('a.update-components-article__image-link');
                if (articleLink && articleLink.href && !processedLinks.has(articleLink.href)) {
                    processedLinks.add(articleLink.href);
                    linksURL.push(articleLink.href);
                }
            });

            console.log(`${linksURL.length} new links found on this page`);

            async function processLinks(linksURL) {
                for (let currentIndex = 0; currentIndex < linksURL.length; currentIndex++) {
                    const link = linksURL[currentIndex];
                    const pageData = await new Promise((resolve, reject) => {
                        chrome.runtime.sendMessage(
                            { action: "createTabAndExtractData", url: link },
                            (response) => {
                                if (chrome.runtime.lastError) {
                                    reject(chrome.runtime.lastError.message);
                                } else {
                                    resolve(response);
                                }
                            }
                        );
                    });

                    if (pageData === false) {
                        console.log("Skipping article due to age restriction");
                        break;
                    }

                    await delay(2000);
                    allArticleData.push(pageData);
                    await delay(1500);
                }
            }

            await processLinks(linksURL);

            const newScrollHeight = htmlElement.scrollHeight;
            if (newScrollHeight === initialScrollHeight) {
                console.log('No new content loaded or scroll position stuck');
                hasMoreArticles = false;
            }
        }
        profileData.posts_article = Array.from(allArticleData);
    }

    await loadAllSkills();
    document.documentElement.scrollTo(0, 0);

    await delay(1000);
    chrome.runtime.sendMessage({ action: "navigate" }, (response) => {
        if (response?.success) {
            console.log(response.message);
        } else {
            console.error("Error:", response?.error);
        }
    });
    console.log("profileData is here", profileData);
}




async function handleListSection() {
    const Section = document.querySelector("section.artdeco-card");
    const navigationSection = Section.querySelector("nav.org-top-card__horizontal-nav-bar.artdeco-card__actions");
    const listSection = navigationSection.querySelectorAll("li.org-page-navigation__item")
    for (const li of listSection) {
        const anchor = li.querySelector("a.org-page-navigation__item-anchor");
        if (anchor && anchor.innerText.trim() === "Posts") {
            anchor.click();
            await delay(1500);
        } else {
            console.log("About navigation not found!");
        }
    }
}

async function clickArticlesButton() {
    const filtersButton = document.querySelector("div.ember-view.org-feed-filters div[role='tablist']");
    const buttons = filtersButton.querySelectorAll('button');
    for (const button of buttons) {
        const buttonText = button.querySelector('span.artdeco-pill__text').textContent.trim();
        if (buttonText === 'Articles') {
            button.click();
            await delay(2000);
        }
    }
}