function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function JobsDetails(profileData, numJobs) {

    await delay(2000);
    await handleListSection();

    const mainCard = document.querySelector("div.artdeco-card.org-jobs-recently-posted-jobs-module")
    const anchorTag = mainCard.querySelector("a.org-jobs-recently-posted-jobs-module__show-all-jobs-btn-link span.t-black--light");
    const anchorText = anchorTag.innerText.trim();
    if (anchorText === "Show all jobs") {
        anchorTag.click();
        await delay(2000);
    } else {
        console.log("Text is not 'Show all jobs', no action taken.");
    }

    const Container = document.querySelector("div.scaffold-layout__list-detail-container")
    const listViewElement = Container.querySelectorAll("li.scaffold-layout__list-item");
    console.log(listViewElement , "list view Element")
}

async function handleListSection() {
    const Section = document.querySelector("section.artdeco-card");
    const navigationSection = Section.querySelector("nav.org-top-card__horizontal-nav-bar.artdeco-card__actions");
    const listSection = navigationSection.querySelectorAll("li.org-page-navigation__item")
    for (const li of listSection) {
        const anchor = li.querySelector("a.org-page-navigation__item-anchor");
        if (anchor && anchor.innerText.trim() === "Jobs") {
            anchor.click();
            await delay(1500);
        }
    }
}

