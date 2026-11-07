// aqui mostra as vagas cadastradas em quadrinhos
//  mas também dá opção de cadastrar mais vagas


import { useLocation } from 'react-router-dom'

import { useState, useEffect } from 'react'

// import Message from '../layout/Message'
import Container from '../layout/Container'
import LinkButton from '../layout/LinkButton'
import ProjectCard from '../project/ProjectCard'

import styles from './Projects.module.css'
import ListaVagas from '../ListaVagas'
import { vagasService } from '../../services/api';

function Projects () {

    const [vagas, setVagas] = useState([])
    const [erro,  setErro]  = useState(null);
    const [projects, setProjects] = useState([])
    const [removeLoading, setRemoveLoading] = useState(false)
    const [projectMessage, setProjectMessage] = useState('')

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

    

    // const location = useLocation() 
    // let message = ''
    // if(location.state) {
    //     message = location.state.message
    // }

    useEffect(() => {
        setTimeout(() => {
        fetch('http://localhost:3000/projects', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then((resp) => resp.json())
        .then((data) => {
        
          setProjects(data)
          setRemoveLoading(true)

           // aqui mostra tudo o que o front tá enviando pra API
            // console.log('Enviando ooo:', JSON.stringify(projects))
          console.log(setProjects(data))


    })
    .catch((err) => console.log(err))
     }, 500)
    }, [] )


    function removeProject(id) {
        fetch(`http://localhost:3002/projects/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    }) .then((resp) => resp.json())
        .then((data) => {
        //   console.log(data)
        //   console.log(data.budget, 'budgET')
          setProjects(projects.filter((project) => project.id !== id))
          setProjectMessage('Projeto removido com sucesso!')
    })
    .catch((err) => console.log(err))
     
    }


    return (
        <div className={styles.project_container}>
            <div className={styles.title_container}>

            <h1>Minhas vagas</h1>

            <LinkButton to="/newproject" text="Cadastrar vagas" /> 
            </div>
            
            <ListaVagas vagas={vagas} />

            {/* {message && <Message type="success" msg={message} /> }
            {projectMessage && <Message type="success" msg={projectMessage} /> }
             */}


                {/* <Container customClass="start">
                {projects.length  > 0 &&
                projects.map((project) => (
                <ProjectCard
                id={project.id} 
                name={project.name}
                cargo={project.cargo}
                status={project.status.name} 
                date={project.date}
                budget={project.budget}
                observação={project.observação}
                key={project.id} 
                handleRemove={removeProject}
                />
                 ))} */}

            {/* </Container> */}
            </div>
        )
}
export default Projects


