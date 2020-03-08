$(function() {
    chrome.storage.sync.get(['publicKey'], function(result) {
        var publicKey = result.publicKey
        getTransactions(publicKey)
        popupContent(publicKey)
    });
});

function getTransactions(publicKey) {
    $('#transactionList').empty()

    var settings = {
        "url": "https://stellar-tip.herokuapp.com/transactions/history",
        "method": "GET",
        "timeout": 0,
        "data": {
            'payerPublicKey': publicKey //'GDVFQQQOCPPQJZLFSABMPBAVKCHPE7KD7SN6CWBH4JEKPE4LVLYMNMYS'
        }
    };
    
    if (publicKey.length) {
        $.ajax(settings).done(function(transactions) {
        ul = document.createElement('ul');
        ul.className = "transactionList"
        document.getElementById('transactionList').appendChild(ul);
        transactions.forEach(transaction => {
            var li = document.createElement('li');
            var date = new Date(transaction.createdAt)
            date = date.toDateString()
            var url = transaction.url 
            var logo = ""
            if (url.indexOf('youtube') != -1) {
                logo = 'https://image.flaticon.com/icons/svg/174/174883.svg'
            } else if (url.indexOf('twitch') != -1) {
                logo = 'https://image.flaticon.com/icons/svg/2111/2111668.svg'
            } else if (url.indexOf('github') != -1) {
                logo = 'https://image.flaticon.com/icons/svg/2111/2111425.svg'
            }
            
            li.innerHTML = `
            <li class="transaction">
                <div class="left">
                    <a href="${url}" target="_blank">
                        <img class="logo" src="${logo}"/>
                    </a>
                    <div class="column">
                        <span class="name"><span>${transaction.payerPublicKey == publicKey ? "to" : "from"}:  </span>${transaction.payeeName}</span>
                        <span>${date}</span>
                    </div>
                </div>
                <div class="right">
                    <span>${transaction.asset}</span>
                    <span class="name ${transaction.payerPublicKey == publicKey ? "to" : "from"}">${transaction.amount.substr(0, 4)}</span>
                </div>
            </li>`
            ul.appendChild(li)
        });
    }).fail(function(res, status, err) {
        console.error(err)
    })
}
};

function popupContent (publicKey) {
    var input = document.createElement('input')
    input.className = "input";

    $(input).on('input',function(e){
        publicKey = e.target.value
        chrome.storage.sync.set({publicKey});
        getTransactions(publicKey);
    });
    input.value = publicKey
    
    document.getElementById("publicKey").appendChild(input);
}
