const express = require('express')
const router = express.Router()
const controller = require('../controllers/advise')

router.get('/', async (req, res, next) => {
    try {
        res.json(await controller.getAdvise(req.query.page))
    } catch (error) {
        next(error)
    }
})

router.post('/', async (req, res, next) => {
    try {
        res.json(await controller.addAdvise(req.body))
    } catch (error) {
        next(error)
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        res.json(await controller.statusChange(req.params.id))
    } catch (error) {
        next(error)
    }
})

module.exports = router