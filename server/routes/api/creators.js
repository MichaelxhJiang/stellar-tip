const express = require('express')
const router = express.Router()

const Creator = require('../../models/Creator');
const findToken = require('../../controllers/cheerio');

router.get('/token', async (req, res) => {
    const data = req.body;
    const { username, url } = data;
    const { token } = await Creator.findOne({username}) || {};
    if (!token) {
        const foundToken = await findToken(url);
        const domain = url.match('\/\/(.[^\/]+)')[1].split('.')[1];
        await Creator.create({
            username,
            domain,
            token: foundToken
        })
        return res.json({token: foundToken})
    }
    else {
        return res.json({token})
    }
});

module.exports = router;