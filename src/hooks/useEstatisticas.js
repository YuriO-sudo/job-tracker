import { useState, useEffect, useCallback } from 'react';
import { vagasService } from '../services/api';
// import axios from 'axios';

// ...

export function useEstatisticas() {
    const [stats,   setStats]   = useState(null);
    const [loading, setLoading] = useState(true);
    const [erro,    setErro]    = useState(null);
    
    const carregar = useCallback(async () => {
        setLoading(true);
        setErro(null);
        try {
            const res = await vagasService.estatisticas();

            // se o vagasService não funfar tem essa opção abaixo
            // const res = await axios.get('http://localhost:3001/api/vagas/stats');
            
            setStats(res.data);
        } catch (err) {
            setErro(err.message || 'Não foi possível carregar as estatísticas.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { carregar(); }, [carregar]);

    return { stats, loading, erro, recarregar: carregar };
}