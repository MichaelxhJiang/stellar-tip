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

function getChannelName() {
  var path = window.location.pathname
  var channel = path.substring(1)

  creatorAddress('twitch', channel).done(function(data, status, res) {
    var address = data.address
    addTipButton()
  }).fail(function(res, status, err) {
    if (res.status === 404) {
      return
    }
    console.error(err)
  })
}

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
    getChannelName();

    if (lastScheduled) clearTimeout(lastScheduled);
    checkURLChanged();
  }
}

function checkURLChanged() {
  if (oldURL !== document.location.href) {
    oldURL = document.location.href;
    
    getChannelName();
  }
  lastScheduled = setTimeout(checkURLChanged, 200);
}
