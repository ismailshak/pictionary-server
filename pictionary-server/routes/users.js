const express = require('express')
const router = express.Router()

// Controller to find specific function implementations
const userController = require('../controllers/users')

router.post('/username/:username/', userController.findByName)
router.post('/create', userController.create)
router.put('/username/:username/', userController.edit)
router.delete('/username/:username/', userController.delete)

module.exports = router;
