const express = require('express')
const router = express.Router()

router.get('/stellar.toml', async(req, res) => {
  res.set('Content-Type', 'text/plain')
  res.send(`SIGNING_KEY="${process.env.STELLAR_PUBLIC_KEY}"`)
});

module.exports = router;
