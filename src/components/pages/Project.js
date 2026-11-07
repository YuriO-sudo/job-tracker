
// aqui é a página de edição dos projetos depois que eles são criados

import styles from './Project.module.css'

import { useParams } from 'react-router-dom'
import { useState,useEffect } from 'react'

import Container from '../layout/Container'
import Message from '../layout/Message'
import ProjectForm from '../project/ProjectForm'

function Project() {

const {id} = useParams()
const [project,setProject] = useState([])
const [showProjectForm,setShowProjectForm] = useState(false)
const [message,setMessage] = useState()
const [type,setType] = useState()

useEffect (() => {
        setTimeout(() => {
        fetch(`http://localhost:3002/projects/${id}`, {
        method: 'GET',
        headers :{
            'Content-Type': 'application/json',
            },
    }).then((resp) => resp.json())
    .then((data) => {
        setProject(data)
    })
    .catch((err) => console.log(err))
        }, 300)
    }, [id])

    function editPost(project) {
        setMessage('')

        fetch(`http://localhost:3002/projects/${project.id}`, {
        method: 'PATCH',
        headers :{
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(project),
        }).then((resp) => resp.json())
    .then((data) => {
        setProject(data)
        setShowProjectForm(false)
        setMessage('Projeto atualizado!')
        setType('success')
        console.log('sucesso! projeto atualizado')
    })
    .catch((err) => console.log(err))
    }

    
    return (<>
        {project.name ? (
            <div className={styles.project_details}>
                <Container customClass="column">
                    {message && <Message type={type} msg={message} />}
                <div className={styles.details_container}>
                    <h1>Projeto: {project.name}</h1>
                    
                     {!showProjectForm ? (
                        <div className={styles.project_info}>
                            {/* <p>
                                <span>Categoria:</span> {project.category.name}
                            </p>
                            <p>
                                <span>Total de Orçamento:</span> R${project.budget}
                            </p>
                            <p>
                                <span>Total Utilizado</span> R${project.cost}
                            </p> */}
                        </div> 
                     ) : (
                        <div className={styles.project_info}>
                            {/* aqui no ProjectForm chama todo o formulário  */}
                            <ProjectForm 
                            handleSubmit={editPost} 
                            btnText="Concluir Edição" 
                            projectData={project} 
                            />
                        </div> 
                     ) }
                        
                </div>

                </Container>
            </div>
        ) : (
            <div>
                <p> loading fica aqui no Project.js</p>
            </div>
            // <Loading/> 
        )}
    </>)

}
export default Project