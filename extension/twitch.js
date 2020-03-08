"use strict";

const buttonHTML = `
<button class="stellar-tip-button follow-btn__follow-notify-container__align-right" onclick="">
  ${stellarSVG}
  <span>&nbsp;Tip</span>
  ${dialogHTML}
</button>
`

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
  $('.channel-header__right').before(buttonHTML)
};

document.onreadystatechange = function () {
  if (document.readyState === 'complete') {
    getChannelName()
  }
}

window.addEventListener('load', function() {
  getChannelName()
});
