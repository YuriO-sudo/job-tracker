import { useEstatisticas } from '../hooks/useEstatisticas';
import './Estatisticas.css';

// const [versao, setVersao] = useState(0);

// depois de criar/excluir uma vaga:
// setVersao((v) => v + 1);


const STATUS = [
    { chave: 'candidatado', rotulo: 'Candidatado', icone: '📤', classe: 'candidatado' },
    { chave: 'emProcesso',  rotulo: 'Em processo', icone: '🔄', classe: 'processo'    },
    { chave: 'entrevista',  rotulo: 'Entrevista',  icone: '🎤', classe: 'entrevista'  },
    { chave: 'oferta',      rotulo: 'Oferta',      icone: '🎉', classe: 'oferta'      },
    { chave: 'aprovado',    rotulo: 'Aprovado',    icone: '✅', classe: 'aprovado'    },
    { chave: 'reprovado',   rotulo: 'Reprovado',   icone: '❌', classe: 'reprovado'   },
];

function percentual(valor, total) {
    if (!total) return 0;
    return Math.round((valor / total) * 100);
}

function Estatisticas() {
    const { stats, loading, erro, recarregar } = useEstatisticas();

    if (loading && !stats) {
        return (
            <section className="stats">
                <div className="stats-estado">
                    <div className="stats-spinner" />
                    <p>Carregando estatísticas...</p>
                </div>
            </section>
        );
    }

    if (erro) {
        return (
            <section className="stats">
                <div className="stats-estado stats-estado--erro">
                    <p>⚠️ {erro}</p>
                    <button type="button" className="stats-btn" onClick={recarregar}>
                        Tentar novamente
                    </button>
                </div>
            </section>
        );
    }

    const total = stats.total;

    return (
        <section className="stats" aria-label="Estatísticas das vagas">

            
            <header className="stats-header">
                <h2 className="stats-titulo">Resumo das candidaturas</h2>
                <button
                    type="button"
                    className="stats-btn"
                    onClick={recarregar}
                    disabled={loading}>
                    {loading ? 'Atualizando...' : '↻ Atualizar'}
                </button>
            </header>

            {/* Card de destaque: total */}
            <div className="stats-total">
                <span className="stats-total-label">Total de vagas</span>
                <span className="stats-total-valor">{total}</span>
            </div>

            {/* Barra de proporção */}
            {total > 0 && (
                <div className="stats-barra" role="img"
                     aria-label="Distribuição das vagas por status">
                    {STATUS.map(({ chave, rotulo, classe }) =>
                        stats[chave] > 0 && (
                            <div
                                key={chave}
                                className={`stats-barra-trecho cor--${classe}`}
                                style={{ width: `${percentual(stats[chave], total)}%` }}
                                title={`${rotulo}: ${stats[chave]}`}
                            />
                        )
                    )}
                </div>
            )}

            {/* Grade de cards por status */}
            <div className="stats-grid">
                {STATUS.map(({ chave, rotulo, icone, classe }) => (
                    <article key={chave} className={`stats-card borda--${classe}`}>
                        <div className="stats-card-topo">
                            <span className="stats-card-icone">{icone}</span>
                            <span className="stats-card-rotulo">{rotulo}</span>
                        </div>
                        <div className="stats-card-valor">{stats[chave]}</div>
                        <div className="stats-card-pct">
                            {percentual(stats[chave], total)}% do total
                        </div>
                    </article>
                ))}
            </div>

        </section>
    );
}

export default Estatisticas;