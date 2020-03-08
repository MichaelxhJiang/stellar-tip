"use strict";

function buttonHTML (requestName, requestAddress) {
  return `
<button class="stellar-tip-button follow-btn__follow-notify-container__align-right" onclick="">
  ${stellarSVG}
  <span>Tip</span>
</button>
`
}

var oldURL;
var lastScheduled;

function getChannelName() {
  var path = window.location.pathname
  var channel = path.substring(1)

  creatorAddress('twitch', channel).done(function(address, status, res) {
    addTipButton(channel, address)
  })
}

function addTipButton (channel, address) {
  var $tipButton = $('.stellar-tip-button');

  if ($tipButton.length) {
    console.log("found existing tip button, will reassign receiver");
    $tipButton.find(".stellar-tip-dialog").hide();
    //todo: have to reassign receiver stellar address in dialog
    return;
  }
  console.log("trying to addTipButton");

  $('.channel-header__right').before(buttonHTML(channel, address))
  $(document.body).append(dialogHTML(channel, address))

  tipSubmitListener($(".stellar-tip-dialog form.stellar-tip-form"))

  $tipButton = $('.stellar-tip-button'); // This line is necessary dont delete it

  if ($tipButton.length) {
    console.log("addTipButton succeeded");

    $tipButton.click(function() {
      if ($('.stellar-tip-dialog').css("display") !== "none") {
        $(".stellar-tip-dialog").hide();
        return;
      }

      $(".stellar-tip-dialog").show();

      var btn = $('.stellar-tip-button')[0];
      var dlg = $('.stellar-tip-dialog')[0];
      Popper.createPopper(btn, dlg, {
        placement: 'bottom',
      });
    })
  }
  else {
    console.log("addTipButton failed, retrying");
    setTimeout(addTipButton, 500);
  }
};

document.onreadystatechange = function () {
  if (document.readyState === 'complete') {
    getPublicKey();

    getChannelName();

    if (lastScheduled) clearTimeout(lastScheduled);
    checkURLChanged();
  }
}

function checkURLChanged() {
  if (oldURL !== document.location.href) {
    oldURL = document.location.href;
    
    // url has changed!
    $('.stellar-tip-button').remove();
    $(".stellar-tip-dialog").remove();
    getChannelName();
  }
  lastScheduled = setTimeout(checkURLChanged, 100);
}
