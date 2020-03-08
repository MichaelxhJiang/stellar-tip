const express = require('express')
const router = express.Router()

const Creator = require('../../models/Creator');
const findAddress = require('../../controllers/findAddress');

router.get('/address', async(req, res) => {
    const data = req.query;
    const { username, domain } = data;
    const creator = await Creator.findOne({ username }) || {};
    if (creator) {
        const { address } = creator;
        if (address) return res.json(address);
        return res.sendStatus(404);
    } else {
        const foundAddress = await findAddress(domain, username)
        if (foundAddress) {
            await Creator.create({
                username,
                domain,
                address: foundAddress
            })
            return res.json({ address: foundAddress })
        }
        return res.sendStatus(404);
    }
});

module.exports = router;