// Aqui é onde ele ele gera todo o texto que tem dentro do card

import { Link } from 'react-router-dom'

import styles from './ProjectCard.module.css'

import { BsPencil, BsFillTrashFill } from 'react-icons/bs'

function ProjectCard({ id, name, cargo, date, budget, status, observação, handleRemove }) {
      
    const remove = (e) => {
        e.preventDefault()
        handleRemove(id)
      }

    return (
    <div className={styles.project_card}>
            <h4>{name}</h4> 
            <p> <span>Cargo:</span> {cargo} </p>
            <p> <span>Status:</span> {status} </p>
            <p> <span>Data:</span> {date} </p>
            <p> <span>Budget:</span> {budget} </p>
            <p> <span>Observação:</span> {observação} </p>

        <div className={styles.project_card_actions}>

            <Link to={`/project/${id}`}>
            <BsPencil />
             Editar
            </Link>

            <button onClick={remove}>
                <BsFillTrashFill /> 
                Excluir
            </button>
            
        </div>
    </div>
    )
}

export default ProjectCard
