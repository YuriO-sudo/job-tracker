require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const pool         = require('./config/db');
const vagasRoutes  = require('./routes/vagas.routes');
const errorHandler = require('./middlewares/errorHandler');

const app  = express();
const PORT = process.env.PORT || 3001;

// app.use(cors({ origin: process.env.CORS_ORIGIN }));

const origensPermitidas = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((o) => o.trim());

app.use(cors({
    origin: (origin, callback) => {
        // origin vem vazio em chamadas sem navegador (Postman, n8n)
        if (!origin || origensPermitidas.includes(origin)) {
            return callback(null, true);
        }
        callback(new Error('Origem não permitida pelo CORS'));
    },
}));


app.use(express.json());

app.use('/api/vagas', vagasRoutes);

// Health check — confirma que a API e o banco estão no ar
app.get('/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ status: 'ok', banco: 'conectado' });
    } catch {
        res.status(503).json({ status: 'erro', banco: 'indisponível' });
    }
});

app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada' }));
app.use(errorHandler);

// Só sobe o servidor se o banco responder
pool.query('SELECT 1')
    .then(() => {
        app.listen(PORT, () =>
            console.log(`API rodando em http://localhost:${PORT}`));
    })
    .catch((err) => {
        console.error('Não foi possível conectar ao PostgreSQL:', err.message);
        process.exit(1);
    });