const express = require('express')
const router = express.Router()

const Creator = require('../../models/Creator');
const findAddress = require('../../controllers/findAddress');

router.get('/address', async (req, res) => {
    const data = req.query;
    const { username, domain } = data;
    const { address } = await Creator.findOne({username}) || {};
    if (!address) {
        foundAddress = await findAddress(domain, username)
        if (foundAddress) {
            await Creator.create({
                username,
                domain,
                address: foundAddress
            })
            return res.json({address: foundAddress})
        }
        return res.sendStatus(404)
    }
    else {
        return res.json({address})
    }
});

module.exports = router;