"use strict";

document.onreadystatechange = function () {
  if (document.readyState === 'complete') {
    addTipButton()
  }
}

function addTipButton () {
  $('div[id="subscribe-button"]').each((index, element) => {
    $(element).before("<button>Tip Me!</button>")
  });
};

// document.body.addEventListener("yt-navigate-finish", function(event) {
// });