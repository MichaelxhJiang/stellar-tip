const express = require('express')
const router = express.Router()

const Creator = require('../../models/Creator');
const findAddress = require('../../controllers/findAddress');

router.get('/address', async (req, res) => {
    const data = req.body;
    const { username } = data;
    const { address } = await Creator.findOne({username}) || {};
    if (!address) {
        foundAddress = findAddress(username)
        await Creator.create({
            username,
            domain,
            address: foundAddress
        })
        return res.json({address: foundAddress})
    }
    else {
        return res.json({address})
    }
});

module.exports = router;