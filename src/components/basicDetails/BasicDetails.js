function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function extractBasicDetails() {
    await delay(1000)
    const currentPageURL = window.location.href;

    const Section = document.querySelector("section.artdeco-card");

    if (!Section) {
        console.log("Section not found!");
        return;
    }

    const logoElement = Section.querySelector("div.org-top-card-primary-content__logo-container img.org-top-card-primary-content__logo");
    const logo = logoElement ? logoElement.getAttribute("src") : "";

    const titleElement = Section.querySelector("div h1.org-top-card-summary__title");
    const title = titleElement ? titleElement.innerText.trim() : "";

    const typeElement = Section.querySelector("div.org-top-card-summary-info-list div.org-top-card-summary-info-list__info-item");
    const type = typeElement ? typeElement.innerText.trim() : "";

    const followersElements = Section.querySelectorAll("div.inline-block div.org-top-card-summary-info-list__info-item");
    const followers = followersElements.length > 1 ? followersElements[1].innerText : "";

    profileData.name = title;
    profileData.type = type;
    profileData.followers = followers;
    profileData.logo = logo;
    profileData.websites_linkedin = currentPageURL;

    await delay(1000);
    return profileData;
}
