import { Fragment, useState } from 'react';
import './ListaVagas.css'

// const expandirTodas = () => setAbertas(new Set(vagas.map((v) => v.id)));
// const recolherTodas = () => setAbertas(new Set());

function ListaVagas({ vagas }) {
    const expandirTodas = () => setAbertas(new Set(vagas.map((v) => v.id)));
    const recolherTodas = () => setAbertas(new Set());

    const [abertas, setAbertas] = useState(new Set());

    const alternar = (id) => {
        setAbertas((prev) => {
            const novo = new Set(prev);
            novo.has(id) ? novo.delete(id) : novo.add(id);
            return novo;
        });
    };

    if (!vagas || vagas.length === 0) {
        return (
            <div className="lista-vazia">
                <span className="lista-vazia-icone">📭</span>
                <p>Nenhuma vaga cadastrada ainda.</p>
            </div>
        );
    }

    return (
        <div className="lista-container">
    
                    <div className="lista-acoes">
                        <button className="btn-lista-acoes" type="button" onClick={expandirTodas}>Expandir todas</button>
                        <button className="btn-lista-acoes" type="button" onClick={recolherTodas}>Recolher todas</button>
                        </div>

            <table className="lista-tabela">
               

                <thead>
                    <tr>
                        <th className="col-seta">Id</th>
                        <th>Empresa</th>
                        <th>Cargo</th>
                        <th>Local</th>
                        <th>Modalidade</th>
                        <th>Nível</th>
                        <th>Salário</th>
                        <th>Status</th>
                        <th>Data</th>
                    </tr>
                </thead>
                <tbody>
                    {vagas.map((vaga) => {
                        const aberta = abertas.has(vaga.id);

                     
                        return (
                            <Fragment key={vaga.id}>
                
                                <tr className={aberta ? 'linha-aberta' : ''}>
                                    <td className="col-seta">
                                        <button
                                            type="button"
                                            className={`btn-seta ${aberta ? 'btn-seta--aberta' : ''}`}
                                            onClick={() => alternar(vaga.id)}
                                            aria-expanded={aberta}
                                            aria-label={aberta ? 'Ocultar detalhes' : 'Mostrar detalhes'}
                                        >
                                            ▶
                                        </button>
                                    </td>
                                    <td className="td-empresa">{vaga.empresa}</td>
                                    <td className="td-cargo">{vaga.cargo}</td>
                                    <td>{vaga.local || '—'}</td>
                                    <td>{vaga.modalidade}</td>
                                    <td>{vaga.nivel}</td>
                                    <td>{formatarSalario(vaga)}</td>
                                    <td>
                                        <span className={`status status--${formatarClasse(vaga.status)}`}>
                                            {vaga.status}
                                        </span>
                                    </td>
                                    <td>{formatarData(vaga.dataAplicacao)}</td>
                                </tr>

                                {aberta && (
                                    <tr className="linha-detalhes">
                                        <td></td>
                                        <td colSpan={8}>
                                            <Detalhes vaga={vaga} />
                                        </td>
                                    </tr>
                                )}

                                {/* </div> */}
                            </Fragment>
                        );
                    })}
                </tbody>
            </table>
            </div>
    );
}

function Detalhes({ vaga }) {
    return (

        <div className="detalhes-grid">
            <div className="detalhe detalhe--largo">
                <span className="detalhe-label">Descrição</span>
                <p className="detalhe-texto">{vaga.descricao || '—'}</p>
            </div>

            <div className="detalhe detalhe--largo">
                <span className="detalhe-label">Observações</span>
                <p className="detalhe-texto">{vaga.observacoes || '—'}</p>
            </div>

            <div className="detalhe">
                <span className="detalhe-label">Link</span>
                {vaga.link ? (
                    <a href={vaga.link} target="_blank" rel="noopener noreferrer">
                        Abrir vaga ↗
                    </a>
                ) : (
                    <p className="detalhe-texto">—</p>
                )}
            </div>

            <div className="detalhe">
                <span className="detalhe-label">Criado em</span>
                <p className="detalhe-texto">{formatarDataHora(vaga.createdAt)}</p>
            </div>

            <div className="detalhe">
                <span className="detalhe-label">Atualizado em</span>
                <p className="detalhe-texto">{formatarDataHora(vaga.updatedAt)}</p>
            </div>

        </div>

        
    

    );
}


function formatarSalario(vaga) {
    const salario = vaga.salarioMin;

    if (salario == null || salario === '') return '—';

    if (isNaN(salario)) {
        return salario;
    }

    return Number(salario).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function formatarData(data) {
    if (!data) return '—';
    // Pega só AAAA-MM-DD para evitar deslocamento de fuso horário
    const [ano, mes, dia] = String(data).slice(0, 10).split('-');
    return `${dia}/${mes}/${ano}`;
}

function formatarDataHora(data) {
    if (!data) return '—';
    return new Date(data).toLocaleString('pt-BR');
}

function formatarClasse(status) {
    return status.toLowerCase().replace(/\s+/g, '-');
}

export default ListaVagas;