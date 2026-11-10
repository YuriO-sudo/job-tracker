import { useState, useEffect } from 'react';
import './Modal.css';

const MODALIDADES = ['Presencial', 'Remoto', 'Híbrido'];
const NIVEIS      = ['Estágio', 'Júnior', 'Pleno', 'Sênior', 'Especialista', 'Gerente'];
const STATUS      = ['Candidatado', 'Em processo', 'Entrevista', 'Oferta', 'Aprovado', 'Reprovado'];

function paraFormulario(vaga) {
    return {
        empresa:       vaga.empresa       ?? '',
        cargo:         vaga.cargo         ?? '',
        local:         vaga.local         ?? '',
        modalidade:    vaga.modalidade    ?? 'Remoto',
        nivel:         vaga.nivel         ?? 'Pleno',
        status:        vaga.status        ?? 'Candidatado',
        salarioMin:    vaga.salarioMin    ?? '',
        salarioMax:    vaga.salarioMax    ?? '',
        dataAplicacao: vaga.dataAplicacao ? String(vaga.dataAplicacao).slice(0, 10) : '',
        link:          vaga.link          ?? '',
        descricao:     vaga.descricao     ?? '',
        observacoes:   vaga.observacoes   ?? '',
    };
}

const paraNumero = (v) => (v === '' || v == null ? null : Number(v));

function ModalEditarVaga({ vaga, onSalvar, onCancelar }) {
    const [form,      setForm]      = useState(() => paraFormulario(vaga));
    const [salvando,  setSalvando]  = useState(false);
    const [erro,      setErro]      = useState(null);
    const [errosCampo, setErrosCampo] = useState({});

    useEffect(() => {
        const aoTeclar = (e) => e.key === 'Escape' && !salvando && onCancelar();
        window.addEventListener('keydown', aoTeclar);
        return () => window.removeEventListener('keydown', aoTeclar);
    }, [salvando, onCancelar]);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrosCampo((prev) => ({ ...prev, [name]: null }));
    }

    function validar() {
        const e = {};
        if (!form.empresa.trim()) e.empresa = 'Obrigatório';
        if (!form.cargo.trim())   e.cargo   = 'Obrigatório';

        const min = paraNumero(form.salarioMin);
        const max = paraNumero(form.salarioMax);
        if (Number.isNaN(min)) e.salarioMin = 'Número inválido';
        if (Number.isNaN(max)) e.salarioMax = 'Número inválido';
        if (min != null && max != null && min > max) {
            e.salarioMax = 'Deve ser maior que o mínimo';
        }

        setErrosCampo(e);
        return Object.keys(e).length === 0;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setErro(null);
        if (!validar()) return;

        const dados = {
            empresa:       form.empresa.trim(),
            cargo:         form.cargo.trim(),
            local:         form.local.trim()       || null,
            modalidade:    form.modalidade,
            nivel:         form.nivel,
            status:        form.status,
            salarioMin:    paraNumero(form.salarioMin),
            salarioMax:    paraNumero(form.salarioMax),
            dataAplicacao: form.dataAplicacao      || null,
            link:          form.link.trim()        || null,
            descricao:     form.descricao.trim()   || null,
            observacoes:   form.observacoes.trim() || null,
        };

        setSalvando(true);
        try {
            await onSalvar(vaga.id, dados);
        } catch (err) {
            setErro(err.message || 'Não foi possível salvar.');
            setSalvando(false);
        }
        // Em caso de sucesso, o App fecha o modal
    }

    const campo = (nome, rotulo, props = {}) => (
        <div className="campo">
            <label htmlFor={nome}>{rotulo}</label>
            <input
                id={nome}
                name={nome}
                value={form[nome]}
                onChange={handleChange}
                className={errosCampo[nome] ? 'campo-erro' : ''}
                {...props}
            />
            {errosCampo[nome] && <span className="campo-msg">{errosCampo[nome]}</span>}
        </div>
    );

    const selecao = (nome, rotulo, opcoes) => (
        <div className="campo">
            <label htmlFor={nome}>{rotulo}</label>
            <select id={nome} name={nome} value={form[nome]} onChange={handleChange}>
                {opcoes.map((o) => <option key={o}>{o}</option>)}
            </select>
        </div>
    );

    return (
        <div className="modal-fundo" onClick={() => !salvando && onCancelar()}>
            <div
                className="modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-editar-titulo"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 id="modal-editar-titulo" className="modal-titulo">
                    Editar vaga
                </h3>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="modal-corpo">
                        <div className="campos-linha">
                            {campo('empresa', 'Empresa *', { type: 'text', autoFocus: true })}
                            {campo('cargo',   'Cargo *',   { type: 'text' })}
                        </div>

                        <div className="campos-linha">
                            {campo('local', 'Local', { type: 'text' })}
                            {campo('dataAplicacao', 'Data de aplicação', { type: 'date' })}
                        </div>

                        <div className="campos-linha campos-linha--3">
                            {selecao('modalidade', 'Modalidade', MODALIDADES)}
                            {selecao('nivel',      'Nível',      NIVEIS)}
                            {selecao('status',     'Status',     STATUS)}
                        </div>

                        <div className="campos-linha">
                            {campo('salarioMin', 'Salário mínimo (R$)', { type: 'number', min: 0, step: '0.01' })}
                            {campo('salarioMax', 'Salário máximo (R$)', { type: 'number', min: 0, step: '0.01' })}
                        </div>

                        {campo('link', 'Link da vaga', { type: 'url', placeholder: 'https://...' })}

                        <div className="campo">
                            <label htmlFor="descricao">Descrição</label>
                            <textarea
                                id="descricao"
                                name="descricao"
                                rows={4}
                                value={form.descricao}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="campo">
                            <label htmlFor="observacoes">Observações</label>
                            <textarea
                                id="observacoes"
                                name="observacoes"
                                rows={3}
                                value={form.observacoes}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {erro && <p className="modal-erro">⚠️ {erro}</p>}

                    <div className="modal-acoes">
                        <button
                            type="button"
                            className="modal-btn modal-btn--secundario"
                            onClick={onCancelar}
                            disabled={salvando}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="modal-btn modal-btn--primario"
                            disabled={salvando}
                        >
                            {salvando ? 'Salvando...' : 'Salvar alterações'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ModalEditarVaga;