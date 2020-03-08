const express = require('express')
const router = express.Router()
const { getTransactionHistory } = require('../../controllers/stellar')

const Transaction = require('../../models/Transaction');

router.post('/', async (req, res) => {
    const data = req.body;
    try {
        await Transaction.create(data)
        return res.sendStatus(200);
    } catch (err) {
        return res.status(500).json(err);
    }
});

router.get('/', async (req, res) => {
    const data = req.body
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