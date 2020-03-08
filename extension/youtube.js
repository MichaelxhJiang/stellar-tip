"use strict";

const buttonHTML = `
<button class="stellar-tip-button" onclick="">
  <img src="https://stealthex.io/db-assets/coins/icons/color/8laQ7QbGctJIdKLm.svg">
  <span>Stellar Tip</span>
  ${dialogHTML}
</button>
`

function addTipButton() {
  var $tipButton = $('.stellar-tip-button');

  if ($tipButton.length) {
    console.log("found existing tip button, will reassign receiver");
    $tipButton.find(".stellar-tip-dialog").hide();
    //todo: have to reassign receiver stellar address in dialog
    return;
  }
  console.log("trying to addTipButton");

  $('#meta-contents #subscribe-button').before(buttonHTML);

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
    addTipButton()
  }
}

document.body.addEventListener("yt-navigate-finish", function(event) {
  addTipButton();
});
