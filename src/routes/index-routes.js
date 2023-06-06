const express = require('express');
const router = express.Router();
const path = require('path');
const controller = require('../controllers/resolucoes-controller')

 router.get('/', (req ,res, next) => {    
    res.status(200).send("api armazenamento...")
});
router.post('/cadastrarResolucao', controller.cadastrarResolucao)

module.exports = router;