var publicKey = undefined

function dialogHTML (receiveName, receiveAddress, additional="") {
  var publicKeyField
  if (publicKey) {
     publicKeyField = `<input name="send-address" type="hidden" value="${publicKey}"></input>`
  } else {
    publicKeyField = `
    <div class='form-row' send-address>
        <div class='input-group'>
            <label for=''>My Stellar Address</label>
            <input name="send-address" maxlength='56' placeholder='XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' type='text'>
        </div>
    </div>`
  }
  return `
<div class="stellar-tip-dialog" role="tooltip" ${additional}>
<form class='modal stellar-tip-form'>
    <div class='content'>
        <div class='form'>
            <input name="receive-name" type="hidden" value="${receiveName}">
            <input name="receive-address" type="hidden" value="${receiveAddress}">
            ${publicKeyField}
            <div class='form-row'>
                <div class='input-group'>
                    <label for=''>Display Name</label>
                    <input name="send-name" placeholder='' type='text'>
                </div>
            </div>
            <div class='form-row'>
                <div class='input-group'>
                    <label for=''>Amount</label>
                    <input name="amount" placeholder='' type='number' min='0' step='0.01'>
                </div>
            </div>
        </div>
    </div>
    <div class='header'>
        <div class='card-type'>
            <div class='card' tabindex="0">
                <b>XLM</b>
            </div>
            <div class='card active' tabindex="0">
                <b>USD</b>
            </div>
            <div class='card' tabindex="0">
                <b>EUR</b>
            </div>
            <div class='card' tabindex="0">
                <b>CAD</b>
            </div>
        </div>
    </div>
    <div class="footer">
      <input type="submit" class='button stellar-tip-dialog-submit' value="Send Tip">
    </div>
</form>
</div>
`
}

const stellarSVG = `
<svg class="octicon" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 321.44 321.44" aria-hidden="true">
  <path d="M288.15,213.79c-11.33,8.05-22.46,16.39-33.68,24.59-8.1,5.92-16.24,11.79-24.34,17.71Q215.27,267,200.42,277.88c-7.17,5.24-14.38,10.43-21.56,15.67a100.55,100.55,0,0,1-12.35,8.3,57.91,57.91,0,0,1-20.76,6.08c-4.35.48-8.57-.09-12.8-.64-4.86-.64-9.7-1.5-14.54-2.28-4.64-.75-9.27-1.54-13.91-2.28s-9.08-1.39-13.62-2.11-8.86-1.44-13.29-2.16L64,296.27,49.61,294c-2.84-.45-5.67-.93-8.5-1.39a2.05,2.05,0,0,0-1.75.47Q29.68,301.14,20,309.21a15.19,15.19,0,0,1-3.93,2.51l-.43-.35A43.34,43.34,0,0,1,0,278V228.09l9-5.4c8-4.83,15.9-9.86,24.06-14.43a81.75,81.75,0,0,1,18.12-6.94,95.3,95.3,0,0,1,26.23-4A70.41,70.41,0,0,1,98,200.65c8.78,2.71,17.6,5.31,26.39,8l11.9,3.61h0a83.52,83.52,0,0,0,22.2,8.23c8,1.72,17.39,2.37,26.62-.07a43.22,43.22,0,0,0,14.93-7.24Q211,207.94,222,202.85q14.4-6.72,28.88-13.26c4.51-2.05,9.26-3.25,12.38-3.1,10.82,0,18.05,3.69,24.05,10.08a39,39,0,0,1,3.31,4.16A9.32,9.32,0,0,1,288.15,213.79Z"/>
  <path d="M15.62,311.37l.43.35a8.43,8.43,0,0,1-1,.39Z"/>
  <circle cx="142.61" cy="146.5" r="34.94"/>
  <circle cx="197.47" cy="65.58" r="29.68"/>
</svg>
`

function creatorAddress(domain, username) {
    var settings = {
        "url": "https://stellar-tip.herokuapp.com/creators/address",
        "method": "GET",
        "timeout": 0,
        "data": {
            "domain": domain,
            "username": username
        }
    };

    return $.ajax(settings).fail(function(res, status, err) {
        if (res.status === 404) {
            return
        }
        console.error(err)
    })
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

    $.ajax(settings).done(function(uri) {
        if (uri && typeof uri === 'string') {
            window.open(uri, '_blank')
        }
    }).fail(function(res, status, err) {
        console.error(err)
    })
}

function tipSubmitListener (tipForm) {
  tipForm.find(".card").click(function() {
    $(this).parent().find(".active").removeClass('active')
    $(this).addClass('active')
  })
  tipForm.submit(function(event) {
    event.preventDefault()
    var data = $(this).serializeArray().reduce(function(obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});
    var asset = $(this).find(".card.active b").text()

    sendTip({
      "sender": {
        "alias":data["send-name"],
        "payer":data["send-address"]
      },
      "receiver":{
        "name":data["receive-name"],
        "payee":data["receive-address"],
      },
      "asset":asset,
      "amount":data["amount"],
      "url":window.location.href
    })
  })
}

function getPublicKey () {
  if (document.readyState === 'complete') {
    chrome.storage.sync.get(['publicKey'], function(result) {
        publicKey = result.publicKey
        if (publicKey) {
            $(".stellar-tip-dialog.send-address").remove()
            $(".stellar-tip-dialog.form").prepend(`
                <input name="send-address" type="hidden" value="${publicKey}">
            `)
        }
    })
  }
}
