const express = require('express')
const router = express.Router()
const stellar = require('../../controllers/stellar')

const Transaction = require('../../models/Transaction');

router.post('/', async (req, res) => {
    const data = req.body;
    const { sender, receiver, asset, amount, url } = data || {};
    const { alias, payer } = sender || {}
    const { name, payee } = receiver || {}
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    const id = firstPart + secondPart;
    const memoID = id + payer.substring(payer.length - 8) + payee.substring(payee.length - 8);
    try {
        await Transaction.create({
            sender: alias, 
            receiver: name,
            memoID,
            url
        })
        const uri = await stellar.uri(payer, payee, asset, amount, id)
        return res.status(200).json(uri);
    } catch (err) {
        return res.status(500).json(err);
    }
});

router.get('/history', async (req, res) => {
    const data = req.query
    const { payerPublicKey } = data
    try {
        var transactionHistory = await stellar.history(payerPublicKey)
        return res.json(transactionHistory)
    } catch (err) {
        console.log(err)
        return res.json([])
    }
});

module.exports = router;