const dialogHTML = `
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
`

function creatorAddress (url, username) {
  var settings = {
    "url": "https://stellar-tip.herokuapp.com/creators/address",
    "method": "GET",
    "timeout": 0,
    "data": {
      "url": url,
      "username": username
    }
  };

  return $.ajax(settings)
}

function sendTip(payload) {
  var settings = {
    "url": "https://stellar-tip.herokuapp.com/transactions",
    "method": "POST",
    "timeout": 0,
    "headers": {
      "Content-Type": "application/json"
    },
    "data": JSON.stringify(payload)
  };
  
  $.ajax(settings).done(function (uri) {
    window.open(uri,'_blank')
  }).fail(function(res, status, err) {
    console.error(err)
  })
}