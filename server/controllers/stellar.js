const stellarUri = require('@stellarguard/stellar-uri')
const stellarSdk = require('stellar-sdk')
const Transaction = require('../Transaction')

const server = new stellarSdk.Server('https://horizon.stellar.org/')
const TransactionStellarUri = stellarUri.TransactionStellarUri

const USD_ASSET = new stellarSdk.Asset('USD', 'GDUKMGUGDZQK6YHYA5Z6AY2G4XDSZPSZ3SW5UN3ARVMO6QSRDWP5YLEX');
const NATIVE_ASSET = stellarSdk.Asset.native()

/**
 * Return the stellar sdk asset object given ISO representation
 */
selectAsset = (asset) => {
    switch (asset) {
        case 'XLM':
            return NATIVE_ASSET
        case 'USD':
            return USD_ASSET
    }
}

/**
 * Create a transaction operation and return the SEP 7 URI
 * 
 * payerPublicKey: string
 * payeePublicKey: string
 * asset: string (XLM, USD)
 * amount: string("0.10", "10")
 * memoId: string
 */
createTransactionUri = async (payerPublicKey, payeePublicKey, asset, amount, memoId) => {
    var transaction;
    
    try {
        const account = await server.loadAccount(payerPublicKey)
        const fee = await server.fetchBaseFee()
        const networkPassphrase = stellarSdk.Networks.PUBLIC
        transaction = new stellarSdk.TransactionBuilder(account, {fee, networkPassphrase})
            .addOperation(
                stellarSdk.Operation.payment({
                    destination: payeePublicKey,
                    asset: selectAsset(asset),
                    amount: amount  
                })
            )
            .setTimeout(30)
            .addMemo(stellarSdk.Memo.text(memoId))
            .build();

        const uri = TransactionStellarUri.forTransaction(transaction); 
        return uri.toString()
    } catch (err) {
        console.log(err)
        return 'error::' + err
    }
}

/**
 * Returns an array of transactions
 * 
 * payerPublicKey: string
 */
getTransactionHistory = async (payerPublicKey) => {
    var transactionHistory = []

    server.transactions()
        .forAccount(payerPublicKey)
        .call()
        .then(async function (page) {
            while (page.records.length) {
                var records = page.records

                for (var i = 0; i < records.length; i++) {
                    try {
                        var operations = await records[i].operations()
                        var operation = operations.records[0]

                        if (operation.type !== 'payment') continue;

                        var transaction = await operation.transaction()

                        var payer = operation.from;
                        var payee = operation.to;
                        var amount = operation.amount;
                        var asset = operation.asset_type == 'native' ? 'XLM' : operation.asset_code;
                        var memo = transaction.memo;
                        var createdAt = transaction.created_at;

                        var key = memo + payer.substring(payer.length - 8) + payee.substring(payee.length - 8);
                        console.log("GENERATED KEY::", key);
                        
                        transactionQuery = Transaction.findOne({key});
                        
                        if (transaction) {
                            transactionObject = {
                                'payerAlias': transactionQuery.sender,
                                'payerPublicKey': payer,
                                'payeeName': transactionQuery.receiver,
                                'payeePublicKey': payee,
                                'url': transactionQuery.url,
                                'amount': amount,
                                'asset': asset,
                                'createdAt': createdAt
                            }
                            transactionHistory.push(transactionObject)
                        }
                    } catch (err) {
                        console.log(err)
                        return 'error::' + err
                    }
                }
                page = await page.next();
            }
        })
        .catch(function (err) {
            console.log(err);
        });

    return transactionHistory
}

module.exports = {
    createTransactionUri,
    getTransactionHistory
}