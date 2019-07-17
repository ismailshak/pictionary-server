const express = require('express')
const router = express.Router()

// Controller to find specific function implementations
const userController = require('../controllers/users')

router.post('/random/', userController.pickAWord)

module.exports = router;
