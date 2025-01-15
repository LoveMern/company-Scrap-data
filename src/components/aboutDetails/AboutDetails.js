function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function AboutDetailsCollection() {
    const Section = document.querySelector("section.artdeco-card");
    const navigationSection = Section.querySelector("nav.org-top-card__horizontal-nav-bar.artdeco-card__actions");
    const listSection = navigationSection.querySelectorAll("li.org-page-navigation__item");

    await handleListSection(listSection);

    const aboutSection = document.querySelector("section.artdeco-card.org-page-details-module__card-spacing");
    if (aboutSection) {
        const description = aboutSection.querySelector("p.t-black--light") ? aboutSection.querySelector("p.t-black--light").innerText : '';
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

        const sizeEmployCountElement = aboutSection.querySelector("dd.t-black--light a.t-black--light span");
        const sizeEmployCount = sizeEmployCountElement ? sizeEmployCountElement.textContent.trim().match(/\d{1,3}(?:,\d{3})*/g) : null;
        const sizeEmployCountNumber = sizeEmployCount ? sizeEmployCount[0] : "";

        const founded = getValueFromDT('Founded');
        const specialties = getValueFromDT('Specialties');
        const specialtiesArray = specialties ? specialties.split(',').map(specialty => specialty.trim()) : [];

        profileData.description = description;
        profileData.websites_main_original = websiteLink;
        profileData.websites_main = websiteLink;
        profileData.industry = industry;
        profileData.size_range = companySize;
        profileData.size_employees_count = sizeEmployCountNumber;
        profileData.founded = founded;
        profileData.specialities = specialtiesArray;
    } else {
        console.log("about section not found!");
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
            await delay(1500);
            const locationConatiner = document.querySelector("div.highcharts-wrapper");
            const locationChart = locationConatiner.querySelector("svg.highcharts-root");
            const globalPath = locationChart.querySelector("g.highcharts-series-group");
            const globalMark = globalPath.querySelector("g.highcharts-markers.highcharts-series-1");
            const locationPaths = globalMark.querySelectorAll("path.highcharts-point");
            let locationNames = [];
            function hoverAndGetTooltipText(paths, index) {
                if (index >= paths.length) {
                    return;
                }
                const path = paths[index];
                const event = new MouseEvent('mouseover', {
                    bubbles: true,
                    cancelable: true,
                    clientX: path.getBoundingClientRect().left + 5,
                    clientY: path.getBoundingClientRect().top + 5
                });

                path.dispatchEvent(event);

                setTimeout(() => {
                    const locationTooltip = locationConatiner.querySelector("div.highcharts-tooltip");
                    const tooltipText = locationTooltip ? locationTooltip.textContent.trim() : '';
                    locationNames.push(tooltipText);
                    hoverAndGetTooltipText(paths, index + 1);
                }, 500);
            }
            hoverAndGetTooltipText(locationPaths, 0);
            profileData.location_hq_regions = locationNames;
        }
    } else {
        console.log("locationSection is not found");
    }

    return profileData;
}


async function handleListSection(listSection) {
    for (const li of listSection) {
        const anchor = li.querySelector("a.org-page-navigation__item-anchor");
        if (anchor && anchor.innerText.trim() === "About") {
            anchor.click();
            await delay(1000);
        }
    }
}
