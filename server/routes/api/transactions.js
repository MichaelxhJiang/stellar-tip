const express = require('express')
const router = express.Router()
const { getTransactionHistory, createTransactionUri } = require('../../controllers/stellar')

const Transaction = require('../../models/Transaction');

router.post('/', async (req, res) => {
    const data = req.body;
    const { sender, receiver, asset, amount, url } = data || {}
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    const id = firstPart + secondPart;
    const memoID = id + sender.substring(sender.length - 8) + receiver.substring(receiver.length - 8);
    try {
        await Transaction.create({
            sender, 
            receiver,
            memoID,
            url
        })
        const uri = createTransactionUri(sender, receiver, asset, amount, memoId)
        res.json(uri);
        return res.sendStatus(200);
    } catch (err) {
        return res.status(500).json(err);
    }
});

router.get('/history', async (req, res) => {
    const data = req.params
    const { payerPublicKey } = data
    try {
        var transactionHistory = await getTransactionHistory(payerPublicKey)
        return res.json(transactionHistory)
    } catch (err) {
        console.log(err)
        return res.json([])
    }
});

module.exports = router;