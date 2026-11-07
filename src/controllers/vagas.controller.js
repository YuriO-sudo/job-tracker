const pool = require('../config/db');

// salario_max    AS "salarioMax",
const COLUNAS = `
    id, empresa, cargo, local, modalidade, nivel,
    salario_min    AS "salarioMin",
    status, link, descricao, observacoes,
    data_aplicacao AS "dataAplicacao",
    created_at     AS "createdAt",
    updated_at     AS "updatedAt"
`;

const STATUS_VALIDOS = [
    'Candidatado', 'Em processo', 'Entrevista',
    'Oferta', 'Aprovado', 'Reprovado'
];

// Evita try/catch repetido: erros async caem no errorHandler
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// GET /api/vagas
const listar = asyncHandler(async (req, res) => {
    const { status, modalidade, busca, ordem } = req.query;

    const condicoes = [];
    const params    = [];

    if (status) {
        params.push(status);
        condicoes.push(`status = $${params.length}`);
    }
    if (modalidade) {
        params.push(modalidade);
        condicoes.push(`modalidade = $${params.length}`);
    }
    if (busca) {
        params.push(`%${busca}%`);
        condicoes.push(
            `(empresa ILIKE $${params.length} OR cargo ILIKE $${params.length})`
        );
    }

    // Nome de coluna não pode ser parâmetro ($1), então usamos whitelist
    const ordenacoes = {
        empresa:        'empresa ASC',
        cargo:          'cargo ASC',
        data_aplicacao: 'data_aplicacao DESC',
    };
    const orderBy = ordenacoes[ordem] || 'created_at DESC';

    const where = condicoes.length ? `WHERE ${condicoes.join(' AND ')}` : '';

    const { rows } = await pool.query(
        `SELECT ${COLUNAS} FROM vagas ${where} ORDER BY ${orderBy}`,
        params
    );

    res.json({ total: rows.length, vagas: rows });
});

// GET /api/vagas/stats
const estatisticas = asyncHandler(async (req, res) => {
    const { rows } = await pool.query(`
        SELECT
            COUNT(*)::int                                      AS total,
            COUNT(*) FILTER (WHERE status = 'Candidatado')::int AS candidatado,
            COUNT(*) FILTER (WHERE status = 'Em processo')::int AS "emProcesso",
            COUNT(*) FILTER (WHERE status = 'Entrevista')::int  AS entrevista,
            COUNT(*) FILTER (WHERE status = 'Oferta')::int      AS oferta,
            COUNT(*) FILTER (WHERE status = 'Aprovado')::int    AS aprovado,
            COUNT(*) FILTER (WHERE status = 'Reprovado')::int   AS reprovado
        FROM vagas
    `);
    res.json(rows[0]);
});

// GET /api/vagas/:id
const buscar = asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
        `SELECT ${COLUNAS} FROM vagas WHERE id = $1`,
        [req.params.id]
    );

    if (rows.length === 0) {
        return res.status(404).json({ erro: 'Vaga não encontrada' });
    }
    res.json(rows[0]);
});

// POST /api/vagas
const criar = asyncHandler(async (req, res) => {
    const {
        empresa, cargo, local, modalidade, nivel,
        salarioMin, status, link,
        descricao, observacoes, dataAplicacao
    } = req.body;

    if (!empresa?.trim() || !cargo?.trim()) {
        return res.status(400).json({
            erro: 'Empresa e cargo são obrigatórios'
        });
    }
    if (status && !STATUS_VALIDOS.includes(status)) {
        return res.status(400).json({
            erro: `Status inválido. Use: ${STATUS_VALIDOS.join(', ')}`
        });
    }

    const { rows } = await pool.query(
        `INSERT INTO vagas (
            empresa, 
            cargo, 
            local, 
            modalidade,
            nivel,
            salario_min,
            status,
            link,
            descricao,
            observacoes,
            data_aplicacao
        ) VALUES (
            $1,
            $2, 
            $3,
            COALESCE($4, 'Remoto'),
            COALESCE($5, 'Pleno'),
            $6, 
            COALESCE($7, 'Candidatado'),
            $8, 
            $9,
            $10,
            COALESCE($11::date, CURRENT_DATE)
        )
        RETURNING ${COLUNAS}`,
        [
            empresa.trim(), 
            cargo.trim(), 
            local || null,
            modalidade || null,
             nivel || null,
            salarioMin || null,
            status || null,
             link || null,
            descricao || null,
             observacoes || null,
            dataAplicacao || null
        ]
    );

    res.status(201).json(rows[0]);
});

// PUT /api/vagas/:id
const atualizar = asyncHandler(async (req, res) => {
    const {
        empresa, cargo, local, modalidade, nivel,
        salarioMin, status, link,
        descricao, observacoes, dataAplicacao
    } = req.body;

    if (!empresa?.trim() || !cargo?.trim()) {
        return res.status(400).json({
            erro: 'Empresa e cargo são obrigatórios'
        });
    }
    if (status && !STATUS_VALIDOS.includes(status)) {
        return res.status(400).json({
            erro: `Status inválido. Use: ${STATUS_VALIDOS.join(', ')}`
        });
    }

    const { rows } = await pool.query(
        `UPDATE vagas SET
            empresa        = $1,
            cargo          = $2,
            local          = $3,
            modalidade     = COALESCE($4, modalidade),
            nivel          = COALESCE($5, nivel),
            salario_min    = $6,
            
            status         = COALESCE($7, status),
            link           = $8,
            descricao      = $9,
            observacoes    = $10,
            data_aplicacao = COALESCE($11::date, data_aplicacao),
            updated_at     = CURRENT_TIMESTAMP
        WHERE id = $12
        RETURNING ${COLUNAS}`,
        [
            empresa.trim(), cargo.trim(), local || null,
            modalidade || null, nivel || null,
            salarioMin || null, 
            status || null, link || null,
            descricao || null, observacoes || null,
            dataAplicacao || null,
            req.params.id
        ]
    );

    if (rows.length === 0) {
        return res.status(404).json({ erro: 'Vaga não encontrada' });
    }
    res.json(rows[0]);
});

// DELETE /api/vagas/:id
const deletar = asyncHandler(async (req, res) => {
    const { rowCount } = await pool.query(
        'DELETE FROM vagas WHERE id = $1',
        [req.params.id]
    );

    if (rowCount === 0) {
        return res.status(404).json({ erro: 'Vaga não encontrada' });
    }
    res.json({ mensagem: 'Vaga removida com sucesso', id: Number(req.params.id) });
});

module.exports = { listar, estatisticas, buscar, criar, atualizar, deletar };