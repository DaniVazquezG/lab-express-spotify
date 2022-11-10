const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {

    console.log(req.user);
    res.render('index');
});


router.get('/', (req, res) => {
    res.render('artist-search')
})

module.exports = router;