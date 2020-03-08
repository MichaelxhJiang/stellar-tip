"use strict";

const buttonHTML = `
<button class="stellar-tip-button" onclick="">
  ${stellarSVG}
  <span>&nbsp;Tip</span>
  ${dialogHTML}
</button>
`

function checkChannel() {
  var url = window.location.href
  if (!url.includes("youtube.com/watch?v=")) {
    // TODO(ethan): should we do retries here?
    return
  }
  var channel = $('#meta-contents #channel-name #text a')
  var channelURL = channel.attr("href")
  var channelName = channel.text()
  if (!channelURL) {
    // TODO(ethan): should we do retries here?
    return
  }
  var channelTokens = channelURL.split("/")
  var channelID = channelTokens[channelTokens.length - 1]

  creatorAddress(url, channelID).done(function(data, status, res) {
    var address = data.address
    addTipButton(channelName, address)
  }).fail(function(res, status, err) {
    if (res.status === 404) {
      return
    }
    console.error(err)
  })
}

function addTipButton(channelName, address) {
  var $tipButton = $('.stellar-tip-button');

  // sendTip({
  //   "sender": {
  //     "alias":"yo",
  //     "payer":"TODO"
  //   },
  //   "receiver":{
  //     "name":channelName,
  //     "payee":address,
  //   },
  //   "asset":"USD",
  //   "amount":"0.5",
  //   "url":window.location.href
  // })

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

document.onreadystatechange = function() {
  if (document.readyState === 'complete') {
    checkChannel()
  }
}

document.body.addEventListener("yt-navigate-finish", function(event) {
  checkChannel();
});
