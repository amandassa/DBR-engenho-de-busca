import express from'express';
const router = express.Router();
//import path from 'path';
import controller from '../controllers/resolucoes-controller.js'

 router.get('/', (req ,res, next) => {    
    res.status(200).send("api armazenamento...")
});
router.post('/cadastrarResolucao', controller.cadastrarResolucao)

export default router;