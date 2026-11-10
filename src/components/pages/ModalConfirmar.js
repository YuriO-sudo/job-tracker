import { useEffect } from 'react';
import './Modal.css';

function ModalConfirmar({
    titulo,
    mensagem,
    textoConfirmar = 'Confirmar',
    carregando = false,
    erro = null,
    onConfirmar,
    onCancelar,
}) {
    useEffect(() => {
        const aoTeclar = (e) => e.key === 'Escape' && !carregando && onCancelar();
        window.addEventListener('keydown', aoTeclar);
        return () => window.removeEventListener('keydown', aoTeclar);
    }, [carregando, onCancelar]);

    return (
        <div className="modal-fundo" onClick={() => !carregando && onCancelar()}>
            <div
                className="modal modal--pequeno"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="modal-titulo"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 id="modal-titulo" className="modal-titulo">{titulo}</h3>
                <p className="modal-mensagem">{mensagem}</p>

                {erro && <p className="modal-erro">⚠️ {erro}</p>}

                <div className="modal-acoes">
                    <button
                        type="button"
                        className="modal-btn modal-btn--secundario"
                        onClick={onCancelar}
                        disabled={carregando}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className="modal-btn modal-btn--perigo"
                        onClick={onConfirmar}
                        disabled={carregando}
                    >
                        {carregando ? 'Excluindo...' : textoConfirmar}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalConfirmar;