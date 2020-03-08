"use strict";

document.onreadystatechange = function () {
  if (document.readyState === 'complete') {
    addTipButton()
  }
}

function addTipButton () {
  $('.channel-header__right').append(`<button>Tip Me!</button>`)
};