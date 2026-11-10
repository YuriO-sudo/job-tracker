import ModalConfirmar from './ModalConfirmar';
import ModalEditarVaga from './ModalEditarVaga';
import { useState, useEffect, useCallback } from 'react'
import LinkButton from '../layout/LinkButton'
import styles from './Projects.module.css'
import ListaVagas from '../ListaVagas'
import { vagasService } from '../../services/api';

function Projects () {

    const [vagas, setVagas] = useState([])
    const [erro,  setErro]  = useState(null);
 
    // daqui pra baixo é implementação do excluir e editar
    const [aviso,   setAviso]   = useState(null);
    const [versao,  setVersao]  = useState(0);   // força o painel de estatísticas a recarregar
    const [editando,  setEditando]  = useState(null);   // vaga em edição
    const [excluindo, setExcluindo] = useState(null);   // vaga aguardando confirmação
    const [apagando,  setApagando]  = useState(false);
    const [erroExclusao, setErroExclusao] = useState(null);


const carregar = useCallback(async () => {
        try {
            const res = await vagasService.listar();
            setVagas(res.data.vagas);
            setErro(null);
        } catch (err) {
            setErro(err.message);
        }
    }, []);

    useEffect(() => { carregar(); }, [carregar]);

    // Mensagem de sucesso que some sozinha
    useEffect(() => {
        if (!aviso) return;
        const t = setTimeout(() => setAviso(null), 3500);
        return () => clearTimeout(t);
    }, [aviso]);

    // ---------- ATUALIZAR ----------
    async function handleSalvar(id, dados) {
        const res = await vagasService.atualizar(id, dados);  // erro sobe para o modal

        setVagas((prev) => prev.map((v) => (v.id === id ? res.data : v)));
        setVersao((n) => n + 1);
        setEditando(null);
        setAviso('Vaga atualizada com sucesso.');
    }

    // ---------- EXCLUIR ----------
    async function handleConfirmarExclusao() {
        setApagando(true);
        setErroExclusao(null);
        try {
            await vagasService.deletar(excluindo.id);

            setVagas((prev) => prev.filter((v) => v.id !== excluindo.id));
            setVersao((n) => n + 1);
            setExcluindo(null);
            setAviso('Vaga excluída.');
        } catch (err) {
            setErroExclusao(err.message || 'Não foi possível excluir.');
        } finally {
            setApagando(false);
        }
    }

    function cancelarExclusao() {
        setExcluindo(null);
        setErroExclusao(null);
    }
// até aqui excluir e deletar

    useEffect(() => {
            vagasService.listar()
                .then((res) => setVagas(res.data.vagas))
                .catch((err) => setErro(err.message));
        }, []);

        const handleCriar = async (dados) => {
                try {
                    const res = await vagasService.criar(dados);
                    setVagas((prev) => [res.data, ...prev]);
                } catch (err) {
                    setErro(err.message);
                }
            };

    
 

    return (
        <div className={styles.project_container}>
            <div className={styles.title_container}>

            <h1>Minhas vagas</h1>

            <LinkButton to="/newproject" text="Cadastrar vagas" /> 
            </div>
            

        {erro && <p className="aviso aviso--erro">⚠️ {erro}</p>}

            <ListaVagas
                vagas={vagas}
                onEditar={setEditando}
                onExcluir={setExcluindo}
            />

            {editando && (
                <ModalEditarVaga
                    vaga={editando}
                    onSalvar={handleSalvar}
                    onCancelar={() => setEditando(null)}
                />
            )}

            {excluindo && (
                <ModalConfirmar
                    titulo="Excluir vaga?"
                    mensagem={`A vaga "${excluindo.cargo}" na empresa ${excluindo.empresa} será removida permanentemente. Essa ação não pode ser desfeita.`}
                    textoConfirmar="Excluir"
                    carregando={apagando}
                    erro={erroExclusao}
                    onConfirmar={handleConfirmarExclusao}
                    onCancelar={cancelarExclusao}
                />
            )}

            {aviso && <div className="toast" role="status">{aviso}</div>}


            </div>
        )
}
export default Projects


