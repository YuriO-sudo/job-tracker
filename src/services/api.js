import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

// Padroniza a mensagem de erro para toda a aplicação
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const mensagem =
            error.response?.data?.erro ||
            (error.code === 'ECONNABORTED'
                ? 'Tempo de resposta esgotado'
                : 'Não foi possível conectar à API');
        return Promise.reject(new Error(mensagem));
    }
);

export const vagasService = {
    listar:       (params)     => api.get('/vagas', { params }),
    buscar:       (id)         => api.get(`/vagas/${id}`),
    criar:        (dados)      => api.post('/vagas', dados),
    atualizar:    (id, dados)  => api.put(`/vagas/${id}`, dados),
    deletar:      (id)         => api.delete(`/vagas/${id}`),
    estatisticas: ()           => api.get('/vagas/stats'),
};

export default api;