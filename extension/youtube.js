"use strict";

const buttonHTML = `
<button class="stellar-tip-button" onclick="">
  <img src="https://stealthex.io/db-assets/coins/icons/color/8laQ7QbGctJIdKLm.svg">
  <span>Stellar Tip</span>
  <div class="stellar-tip-dialog" style="display:none;">
    <div class=stellar-tip-dialog-inner>
      <form>
        <table>
          <tr>
            <td>
              <label for="display_name">Display name&nbsp;</label>
            </td>
            <td>
              <input type="text" name="display_name" style="width: 12em;" />
            </td>
          </tr>
          <tr>
            <td>
              <label for="message">Message&nbsp;</label>
            </td>
            <td>
              <input type="text" name="message" placeholder="(optional)" style="width: 12em;" />
            </td>
          </tr>
          <tr>
            <td>
              <label for="amount">Amount&nbsp;</label>
            </td>
            <td>
              <input type="text" name="amount" style="width:7.75em;" />
              <select name="asset" style="width:4em;">
                <option value="XLM">XLM</option>
                <option value="USD">USD</option>
                <option value="USD">CAD</option>
                <option value="USD">EUR</option>
              </select>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <button>Send Tip</button>
            </td>
          </tr>
        </table>
      </form>
    </div>
  </div>
</button>
`

function addTipButton() {
  if ($('.stellar-tip-button').length) {
    console.log("found existing tip button, will reassign receiver");
    // will have to reassign receiver stellar address in dialog
    return;
  }
  console.log("trying to addTipButton");

  $('#meta-contents #subscribe-button').before(buttonHTML);

  var $tipButton = $('.stellar-tip-button');

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
