function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function AboutDetailsCollection() {
    const Section = document.querySelector("section.artdeco-card");
    const navigationSection = Section.querySelector("nav.org-top-card__horizontal-nav-bar.artdeco-card__actions");
    const listSection = navigationSection.querySelectorAll("li.org-page-navigation__item")

    await handleListSection(listSection);

    const aboutSection = document.querySelector("section.artdeco-card.org-page-details-module__card-spacing");
    if (aboutSection) {
        const description = aboutSection.querySelector("p.t-black--light").innerText;
        const dl = aboutSection.querySelector("dl.overflow-hidden");

        function getValueFromDT(dtText) {
            const dtElements = dl.querySelectorAll("dt");
            for (let dt of dtElements) {
                const h3 = dt.querySelector("h3");
                if (h3 && h3.textContent.trim() === dtText) {
                    const dd = dt.nextElementSibling;
                    return dd ? dd.textContent.trim() : '';
                }
            }
            return '';
        }

        const websiteLinkElement = dl.querySelector("dd a.link-without-visited-state");
        const websiteLink = websiteLinkElement ? websiteLinkElement.getAttribute("href").trim() : "";
        const industry = getValueFromDT('Industry');
        const companySize = getValueFromDT('Company size');
        const sizeEmployCountElement = aboutSection.querySelector("dd.t-black--light a.t-black--light span").textContent.trim();
        const sizeEmployCount = sizeEmployCountElement.match(/\d{1,3}(?:,\d{3})*/g);
        const sizeEmployCountNumber = sizeEmployCount ? sizeEmployCount[0] : "";
        const founded = getValueFromDT('Founded');
        const specialties = getValueFromDT('Specialties');
        const specialtiesArray = specialties.split(',').map(specialty => specialty.trim());

        profileData.description = description;
        profileData.websites_main_original = websiteLink;
        profileData.websites_main = websiteLink;
        profileData.industry = industry;
        profileData.size_range = companySize;
        profileData.size_employees_count = sizeEmployCountNumber;
        profileData.founded = founded;
        profileData.specialities = specialtiesArray;
    } else {
        console.log("about section not found!")
    }

    const locationSection = document.querySelector("div.artdeco-card.org-about-module__margin-bottom");

    if (locationSection) {
        const locationElement = locationSection.querySelector("p.t-normal");
        await delay(1000);
        if (locationElement) {
            const location = locationElement.innerText;
            const locationParts = location.split(',');
            const countryName = locationParts[locationParts.length - 1].trim();
            profileData.location_hq_raw_address = location;
            profileData.location_hq_country = countryName;
            profileData.location_hq_regions = [];
        } else {
            console.log("need for add get mark location logic!");
            await delay(1500)
            const locationConatiner = document.querySelector("div.highcharts-wrapper")
            const locationTooltip = locationConatiner.querySelector("div.highcharts-label.highcharts-tooltip");
            console.log("locationTooltip", locationConatiner)
        }
    } else {
        console.log("locationSection is not found");
    }
    console.log("profileData", profileData);
    return profileData;
}

async function handleListSection(listSection) {
    for (const li of listSection) {
        const anchor = li.querySelector("a.org-page-navigation__item-anchor");
        if (anchor && anchor.innerText.trim() === "About") {
            anchor.click();
            await delay(1000);
        } else {
            console.log("About navigation not found!");
        }
    }
}
