const scrapeButton = document.getElementById("scrapeButton")


scrapeButton.addEventListener("click", () => {
  const buttonText = document.getElementById("buttonText");
  const loader = document.getElementById("loader");
  buttonText.textContent = "Scraping...";
  loader.style.display = "inline-block";


  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const [tab] = tabs;
    chrome.tabs.sendMessage(tab.id, { message: "START_SCRAPE" }, (response) => {
      if (response && response.status === "Scraping started") {
        console.log("Scraping has started:");
      }
    });
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "SCRAPE_COMPLETE") {
    const buttonText = document.getElementById("buttonText");
    const loader = document.getElementById("loader");
    buttonText.textContent = "Scrape Profile";
    loader.style.display = "none";
  }
});
