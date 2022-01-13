
try {
  chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    console.log(request)
    if (request.type == "open-url") {
      console.log(request.url)
      chrome.tabs.create({ url: request.url, active: false });
    }
    return true;
  });
}
catch (e) {
  console.error(e);
}
