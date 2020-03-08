const express = require('express')
const router = express.Router()

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

module.exports = router;