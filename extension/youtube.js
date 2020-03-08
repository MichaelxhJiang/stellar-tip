"use strict";

function buttonHTML (receiveName, receiveAddress) {
  return `
<button class="stellar-tip-button" onclick="">
  ${stellarSVG}
  <span>Tip</span>
</button>
${dialogHTML(receiveName, receiveAddress)}
`
}

var oldURL;
var invalidateOldURL = true;

function checkChannel() {
  const url = window.location.href;
  if (!url.includes("youtube.com/watch?v=")) {
    return
  }
  var channel = $('#meta-contents #channel-name #text a')
  var channelURL = channel.attr("href")
  var channelName = channel.text()
  if (!channelURL || (invalidateOldURL && channelURL === oldURL)) {
    setTimeout(checkChannel, 500);
    return
  }
  invalidateOldURL = false;
  oldURL = channelURL;
  var channelTokens = channelURL.split("/")
  var channelID = channelTokens[channelTokens.length - 1]

  creatorAddress('youtube', channelID).done(function(address, status, res) {
    addTipButton(channelName, address)
  })
}

function addTipButton(channelName, address) {
  var $tipButton = $('.stellar-tip-button');

  if ($tipButton.length) {
    console.log("found existing tip button, will reassign receiver");
    $tipButton.find(".stellar-tip-dialog").hide();
    //todo: have to reassign receiver stellar address in dialog
    return;
  }
  console.log("trying to addTipButton");

  $('#meta-contents #subscribe-button').before(buttonHTML(channelName, address));

  $tipButton = $('.stellar-tip-button'); // This line is necessary dont delete it

  if ($tipButton.length) {
    console.log("addTipButton succeeded");

    $tipButton.click(function() {
      $(".stellar-tip-dialog").show();

      var btn = $('.stellar-tip-button')[0];
      var dlg = $('.stellar-tip-dialog')[0];
      Popper.createPopper(btn, dlg, {
        placement: 'bottom',
      });
    })
    tipSubmitListener($(".stellar-tip-dialog form.stellar-tip-form"))
  }
  else {
    console.log("addTipButton failed, retrying");
    setTimeout(addTipButton, 500);
  }
};

document.onreadystatechange = function() {
  if (document.readyState === 'complete') {
    getPublicKey();
    checkChannel();
  }
}

document.body.addEventListener("yt-navigate-start", function(event) {
  $('.stellar-tip-button').remove();
});

document.body.addEventListener("yt-navigate-finish", function(event) {
  invalidateOldURL = true;
  checkChannel();
});
