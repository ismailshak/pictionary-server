const express = require('express')
const router = express.Router()

// Controller to find specific function implementations
const roomController = require('../controllers/rooms')

router.get('/', roomController.index),
router.get('/:id', roomController.findById),
router.post('/create', roomController.create),
router.put('/edit/:id', roomController.edit)
router.delete('/delete/:id', roomController.delete)

module.exports = router;
