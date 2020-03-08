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
