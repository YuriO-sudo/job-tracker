const express    = require('express');
const controller = require('../controllers/vagas.controller');

const router = express.Router();

// /stats precisa vir ANTES de /:id, senão "stats" vira um id
router.get('/stats', controller.estatisticas);

router.get('/',       controller.listar);
router.get('/:id',    controller.buscar);
router.post('/',      controller.criar);
router.put('/:id',    controller.atualizar);
router.delete('/:id', controller.deletar);

module.exports = router;