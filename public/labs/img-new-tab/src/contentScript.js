console.log("Gdoc content script loaded");

function openUrl(url) {
  chrome.runtime.sendMessage({
    type: 'open-url',
    url: url
  });
}

window.addEventListener("mousedown", event => {
  if (event.ctrlKey && event.shiftKey) {
    event.preventDefault();
    // Google Docs 
    // Google Slides
    if (event.target.nodeName === "image" && event.target.href.baseVal) {
      openUrl(event.target.href.baseVal);
    }
    // Background image
    if (event.target.style.backgroundImage) {
      let str = event.target.style.backgroundImage;
      let reg = /(?:\(['"]?)(.*?)(?:['"]?\))/;
      let url = reg.exec(str)[1];
      let host = window.location.protocol + "//" + window.location.host;
      if (url[0] === "/") {
        url = host + url;
      }
      openUrl(url);
    }
  }

});

window.addEventListener("mouseup", event => {
  if (event.ctrlKey && event.shiftKey) {
    event.preventDefault();
    // Google Sheets 
    // Normal img tags
    if (event.target.nodeName === "IMG" && event.target.src) {
      openUrl(event.target.src);
    }
  }
});

window.addEventListener("click", event => {
  if (event.ctrlKey && event.shiftKey) {
    // Prevent anchor tag from opening a new tab if possible
    if (event.target.nodeName === "IMG" && event.target.src) {
      event.preventDefault();
    }
    // Prevent anchor tag from opening a new tab if possible
    if (event.target.style.backgroundImage) {
      event.preventDefault();
    }

    // Instagram
    if (window.location.host === 'www.instagram.com') {
      let img = event.target.parentNode.querySelector("img");
      if (img) {
        openUrl(img.src);
      }
    }
  }

});


