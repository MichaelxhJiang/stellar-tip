const stellarUri = require('@stellarguard/stellar-uri')
const stellarSdk = require('stellar-sdk')
const Transaction = require('../models/Transaction')

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
const createTransactionUri = async (payerPublicKey, payeePublicKey, asset, amount, memoId = "test") => {
    var transaction;

    try {
        const account = await server.loadAccount(payerPublicKey)
        const fee = await server.fetchBaseFee()
        const networkPassphrase = stellarSdk.Networks.PUBLIC
        transaction = new stellarSdk.TransactionBuilder(account, { fee, networkPassphrase })
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
        return err
    }
}

/**
 * Returns an array of transactions
 * 
 * payerPublicKey: string
 */
const getTransactionHistory = async (payerPublicKey) => {

    var transactionHistory = []

    var page = await server.transactions()
        .forAccount(payerPublicKey)
        .call()

    while (page && page.records && page.records.length) {
        records = page.records
        for (var i = 0; i < records.length; i++) {
            try {
                var operations = await records[i].operations()
                var operation = operations.records[0]
                if (operation.type !== 'payment') continue;

                var transaction = await operation.transaction()
                if (!transaction.memo) continue;

                var payer = operation.from;
                var payee = operation.to;
                var amount = operation.amount;
                var asset = operation.asset_type == 'native' ? 'XLM' : operation.asset_code;
                var memo = transaction.memo;
                var createdAt = transaction.created_at;

                var memoID = memo + payer.substring(payer.length - 8) + payee.substring(payee.length - 8);

                const transactionItem = await Transaction.findOne({memoID});

                if (transactionItem) {
                    transactionObject = {
                        'payerAlias': transactionItem.sender,
                        'payerPublicKey': payer,
                        'payeeName': transactionItem.receiver,
                        'payeePublicKey': payee,
                        'url': transactionItem.url,
                        'amount': amount,
                        'asset': asset,
                        'createdAt': createdAt
                    }
                    transactionHistory.push(transactionObject)
                }
            } catch (err) {
                console.log(err)
                return err
            }
        }
        page = await page.next();
    }
    return transactionHistory;
}

module.exports = {
    uri: createTransactionUri,
    history: getTransactionHistory
}