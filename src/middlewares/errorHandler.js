function errorHandler(err, req, res, next) {
    console.error(`[${req.method} ${req.originalUrl}]`, err.message);
    
    // Erros comuns do PostgreSQL
    if (err.code === '22P02') {   // tipo inválido (ex: id = "abc")
        return res.status(400).json({ erro: 'Parâmetro inválido' });
    }
    if (err.code === '23505') {   // violação de unicidade
        return res.status(409).json({ erro: 'Registro duplicado' });
    }

    // console.log('ta chegando aqui?')
    // res.status(500).json({ erro: 'Erro interno do servidor' });

res.status(500).json({
        erro: 'Erro interno do servidor',
        // detalhe só fora de produção
        detalhe: process.env.NODE_ENV === 'production' ? undefined : err.message,
    });

}

module.exports = errorHandler;