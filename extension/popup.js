$(function() {
    console.log("hello")
    var settings = {
        "url": "https://stellar-tip.herokuapp.com/transactions/history",
        "method": "GET",
        "timeout": 0,
        "data": {
            'payerPublicKey': 'GDVFQQQOCPPQJZLFSABMPBAVKCHPE7KD7SN6CWBH4JEKPE4LVLYMNMYS'
        }
    };

    $.ajax(settings).done(function(transactions) {
        ul = document.createElement('ul');
        ul.className = "transactionList"
        document.getElementById('transactionList').appendChild(ul);
        transactions.forEach(transaction => {
            console.log(transaction)
            var li = document.createElement('li');
            var msg = transaction.payerAlias + " paid " + transaction.payeeName + " " + transaction.amount + " " + transaction.asset
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
                        <span class="name">${transaction.payeeName}</span>
                        <span>${date}</span>
                    </div>
                </div>
               <div class="right">
                   <span>${transaction.asset}</span>
                   <span class="name">${transaction.amount.substr(0, 4)}</span>
               </div>
           </li>
           `
            ul.appendChild(li)
        });
    }).fail(function(res, status, err) {
        console.error(err)
    })
});