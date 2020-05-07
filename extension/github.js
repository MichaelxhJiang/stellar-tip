"use strict";

document.onreadystatechange = function () {
  if (document.readyState === 'complete') {
    getPublicKey()

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
  var currentUser = $('meta[name="user-login"]').attr('content')
  if (currentUser == username) return

  creatorAddress('github', username).done(function(address, status, res) {
    $(element).prepend(`
    <details id="stellar-tip-button-${index}" class="github-stellar-tip-button details-overlay details-reset position-relative d-inline-block">
      <summary class="btn-link link-gray" aria-label="Tip some stellar" aria-haspopup="menu" role="button" style="display: inline-block; padding: 8px 4px; color: #6a737d;">
        ${stellarSVG}
      </summary>
    </details>
    `)
    $(document.body).append(dialogHTML(username, address, `id="stellar-tip-dialog-${index}"`))
    var btn = $(`#stellar-tip-button-${index}`)[0];
    var dlg = $(`#stellar-tip-dialog-${index}`)[0];
    Popper.createPopper(btn, dlg, {
      placement: 'bottom',
    });
    var $tipButton = $(element).find(`#stellar-tip-button-${index}`)

    $tipButton.click(function() {
      if ($(`#stellar-tip-dialog-${index}`).css("display") !== "none") {
        $(`#stellar-tip-dialog-${index}`).hide();
        return;
      }
      
      $(".stellar-tip-dialog").each((i, e) => {
        if (e.id !== `#stellar-tip-dialog-${index}`) {
          $(e).hide();
        }
      });

      $(`#stellar-tip-dialog-${index}`).show()
    })
    tipSubmitListener($(`#stellar-tip-dialog-${index} form.stellar-tip-form`))
  })
}

function addTipButtonToDropdown (dropdown) {
  var actions = dropdown.find(".timeline-comment-actions")
  if (!actions.length) return setTimeout(addTipButtonToDropdown, 1000, dropdown)
  actions.each(addTipButton)
}
