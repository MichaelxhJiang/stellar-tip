"use strict";

const buttonHTML = `
<button class="stellar-tip-button follow-btn__follow-notify-container__align-right" onclick="">
  ${stellarSVG}
  <span>Tip</span>
  ${dialogHTML}
</button>
`

var oldURL;
var lastScheduled;

function addTipButton () {
  var $tipButton = $('.stellar-tip-button');

  if ($tipButton.length) {
    console.log("found existing tip button, will reassign receiver");
    $tipButton.find(".stellar-tip-dialog").hide();
    //todo: have to reassign receiver stellar address in dialog
    return;
  }
  console.log("trying to addTipButton");

  $('.channel-header__right').before(buttonHTML)

  $tipButton = $('.stellar-tip-button'); // This line is necessary dont delete it

  if ($tipButton.length) {
    console.log("addTipButton succeeded");

    $tipButton.click(function() {
      $(this).find(".stellar-tip-dialog").show();
    })
  }
  else {
    console.log("addTipButton failed, retrying");
    setTimeout(addTipButton, 500);
  }
};

document.onreadystatechange = function () {
  if (document.readyState === 'complete') {
    addTipButton();

    if (lastScheduled) clearTimeout(lastScheduled);
    checkURLChanged();
  }
}

function checkURLChanged() {
  if (oldURL !== document.location.href) {
    oldURL = document.location.href;
    
    addTipButton();
  }
  lastScheduled = setTimeout(checkURLChanged, 200);
}