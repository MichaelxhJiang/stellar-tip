// import { TransactionStellarUri } from '@stellarguard/stellar-uri';
// import { Transaction } from 'stellar-sdk';

const stellar_uri = require('@stellarguard/stellar-uri')
const stellar_sdk = require('stellar-sdk')
const Transaction = stellar_sdk.Transaction
const server = new stellar_sdk.Server('https://horizon.stellar.org/')
const TransactionStellarUri = stellar_uri.TransactionStellarUri

const PUBLIC_KEY = 'GDVFQQQOCPPQJZLFSABMPBAVKCHPE7KD7SN6CWBH4JEKPE4LVLYMNMYS'
const PAYEE_PUBLIC_KEY = 'GCQI3DMK45VCECJLFYIFYMMSQ3DPR3XPLJVDTBQYP7IH7MSCF7V3TFDU'

const USD_ASSET = new stellar_sdk.Asset('USD', 'GDUKMGUGDZQK6YHYA5Z6AY2G4XDSZPSZ3SW5UN3ARVMO6QSRDWP5YLEX');
const NATIVE_ASSET = stellar_sdk.Asset.native()

extractTransactionFromUri = async () => {
    /**
     * CONVERT URI TO STELLAR SDK TRANSACTION OBJECT
     */

    const uri = stellar_uri.parseStellarUri(
        'web+stellar:tx?xdr=AAAAAP%2Byw%2BZEuNg533pUmwlYxfrq6%2FBoMJqiJ8vuQhf6rHWmAAAAZAB8NHAAAAABAAAAAAAAAAAAAAABAAAAAAAAAAEAAAAA%2F7LD5kS42DnfelSbCVjF%2Burr8GgwmqIny%2B5CF%2FqsdaYAAAAAAAAAAACYloAAAAAAAAAAAA'
      );
    
    const transaction = uri.getTransaction(); // a StellarSdk.Transaction
    console.log(transaction)
    
    return transaction
}

createTransactionUri = async () => {
    /**
     * CREATE A TRANSACTION OBJECT AND CONVERT TO URI
     */
    var transaction;
    
    try {
        const account = await server.loadAccount(PUBLIC_KEY)
        const fee = await server.fetchBaseFee()
        const networkPassphrase = stellar_sdk.Networks.PUBLIC
        transaction = new stellar_sdk.TransactionBuilder(account, {fee, networkPassphrase})
            .addOperation(
                // this operation funds the new account with XLM
                stellar_sdk.Operation.payment({
                    destination: PAYEE_PUBLIC_KEY,
                    asset: USD_ASSET,
                    amount: "0.10"  
                })
            )
            .setTimeout(30)
            .addMemo(stellar_sdk.Memo.text('Hello world!'))
            .build();
        const uri = TransactionStellarUri.forTransaction(transaction); 

        console.log(uri.toString())
        return uri.toString()
    } catch (err) {
        console.log("ERROR")
        console.log(err)
        return
    }
}

getAccountHistory = async () => {
    var records = []
    server.transactions()
        .forAccount(PUBLIC_KEY)
        .call()
        .then(async function (page) {
            while (page.records.length) {
                console.log("PAGE::", page)
                records = page.records

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
                        var createdAt = transaction.created_at

                        console.log("PAYER::", payer);
                        console.log("PAYEE::", payee);
                        console.log("AMOUNT::", amount);
                        console.log("MEMO::", memo);
                        console.log("ASSET::", asset);
                        console.log("CREATED_AT::", createdAt)
                    } catch (err) {
                        console.log("ERROR")
                        console.log(err)
                        return
                    }
                }
                page = await page.next();
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}

// transaction_uri = createTransactionUri()
account_history = getAccountHistory()