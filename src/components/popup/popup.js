const scrapeButton = document.getElementById("scrapeButton");
const environmentSelect = document.getElementById("environment");
const numberOfPost = document.getElementById("numPosts");
const numberOfJobs = document.getElementById("numJobs");

scrapeButton.addEventListener("click", () => {
  const buttonText = document.getElementById("buttonText");
  const loader = document.getElementById("loader");

  // if (!environmentSelect.value || !numberOfPost.value || !numberOfJobs.value) {
  //   alert("Please select Environment, Number of Posts and Number of Jobs Option for scraping collection");
  //   return
  // }

  const environment = environmentSelect.value;
  const numPosts = parseInt(numberOfPost.value);
  const numJobs = parseInt(numberOfJobs.value);


  buttonText.textContent = "Scraping...";
  loader.style.display = "inline-block";

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const [tab] = tabs;
    chrome.tabs.sendMessage(tab.id, {
      message: "START_SCRAPE",
      environment: environment,
      numPosts: numPosts,
      numJobs: numJobs
    }, (response) => {
      if (response && response.status === "Scraping started") {
        console.log("Scraping has started");
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
