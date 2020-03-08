"use strict";

document.onreadystatechange = function () {
  if (document.readyState === 'complete') {
    addAllTipButtons()

    $('.file-header').click(function() {
      addTipButtonToDropdown($(this).parent())
    })
  }
}

function addAllTipButtons () {
  $('.timeline-comment-actions').each(addTipButton)
}

function addTipButton (index, element) {
  var $tipButton = $(element).find('.github-stellar-tip-button')
  if ($tipButton.length) return

  var username = $(element).parent().find(".author").text()
  // don't self tip
  // var currentUser = $('meta[name="user-login"]').attr('content')
  // if (currentUser == username) return

  creatorAddress('github', username).done(function(address, status, res) {
    var $tipButton = $(element).prepend(`
    <details class="github-stellar-tip-button details-overlay details-reset position-relative d-inline-block">
      <summary class="btn-link link-gray" aria-label="Tip some stellar" aria-haspopup="menu" role="button" style="display: inline-block; padding: 8px 4px; color: #6a737d;">
        <svg class="octicon octicon-plus-small" style="margin-right: -1px;" viewBox="0 0 7 16" version="1.1" width="7" height="16" aria-hidden="true">
          <path fill-rule="evenodd" d="M4 4H3v3H0v1h3v3h1V8h3V7H4V4z"></path>
        </svg>
        <svg class="octicon" viewBox="0 0 400 338" version="1.1" width="16" height="16" aria-hidden="true">
          <path fill-rule="nonzero" d="M400,84.5271453 L400,118.939198 L385.44593,126.342184 C374.392139,131.980599 367.80716,143.694538 368.742596,156.055538 C369.064139,160.348593 369.233373,164.692354 369.233373,169.036115 C369.212753,232.572856 333.515892,290.730451 276.83249,319.576332 C220.149089,348.422212 152.056394,343.082568 100.575393,305.754727 L100.575393,305.754727 L130.462007,290.543113 L132.154341,289.647318 C175.045397,313.665727 227.469819,313.179925 269.907251,288.370803 C312.344683,263.56168 338.436269,218.146655 338.466746,169.036115 C338.464839,162.954839 338.069135,156.880051 337.282112,150.849785 L337.282112,150.849785 L104.467761,269.331361 L56.3039431,293.838963 L-1.13686838e-13,322.487503 L-1.13686838e-13,287.990942 L56.6931799,259.139579 L84.244373,245.094189 L400,84.5271453 Z M123.125979,18.4448113 C179.80966,-10.4208604 247.914578,-5.09391459 299.407683,32.2329945 L299.407683,32.2329945 L295.295312,34.328817 L267.727196,48.357306 C224.847129,24.4394636 172.493163,24.9813345 130.118621,49.7815741 C87.7440788,74.5818138 61.6825785,119.933592 61.617871,168.98541 C61.6203404,175.027356 62.0160526,181.062753 62.8025047,187.053428 L62.8025047,187.053428 L295.379929,68.7408696 L343.543747,44.2332683 L400,15.4664148 L400,49.9798782 L343.05297,78.966455 L315.501777,92.9780423 L70.3164664,217.747086 L56.6593332,224.693723 L42.79912,231.758673 L-1.13686838e-13,253.545086 L-1.13686838e-13,219.01472 L14.5371467,211.611735 C25.6008024,205.981654 32.1943942,194.264266 31.257404,181.898381 C30.9302194,177.627861 30.7666272,173.340439 30.7666272,169.036115 C30.7600579,105.490136 66.4422975,47.3104829 123.125979,18.4448113 Z"></path>
        </svg>
      </summary>
      ${dialogHTML(username, address)}
    </details>
    `)
    $tipButton.click(function() {
      $(this).find(".stellar-tip-dialog").show()
    })
    tipSubmitListener($tipButton.find("form.stellar-tip-form"))
  })
}

function addTipButtonToDropdown (dropdown) {
  var actions = dropdown.find(".timeline-comment-actions")
  if (!actions.length) return setTimeout(addTipButtonToDropdown, 1000, dropdown)
  actions.each(addTipButton)
}
