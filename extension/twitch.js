"use strict";

const buttonHTML = `
<button class="stellar-tip-button follow-btn__follow-notify-container__align-right" onclick="">
  ${stellarSVG}
  <span>&nbsp;Tip</span>
  ${dialogHTML}
</button>
`

function tryAddTipButton () {
  $('.channel-header__right').before(buttonHTML)
};

document.onreadystatechange = function () {
  if (document.readyState === 'complete') {
    updateTipButton()
  }
}

window.addEventListener('locationchange', function() {
  updateTipButton()
});
