const express = require('express')
const router = express.Router()

// Controller to find specific function implementations
const wordController = require('../controllers/words')

router.get('/random/', wordController.pickAWord)

module.exports = router;
