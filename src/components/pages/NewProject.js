import ProjectForm from '../project/ProjectForm'
import styles from './NewProject.module.css'
import { useNavigate } from 'react-router-dom'

function NewProject() {
    const navigate = useNavigate();

    function createPost(project) {

        // fetch('http://localhost:3002/projects', {
            fetch('http://localhost:3001/api/vagas', {
                
        method: 'POST',
        headers :{
            'Content-Type': 'application/json',
            },
            
                body: JSON.stringify(project),
    }) 
    .then((resp) => resp.json())
        .then((data) => {

            // aqui mostra tudo o que o front tá enviando pra API
            console.log('Enviando:', JSON.stringify(project))

        navigate('/projects', {message: 'Projeto criado com sucesso!'})
    })
    .catch((err) => console.log(err))

    }

    return (
        <div className={styles.newproject_container}>
        <h1>Cadastrar vagas</h1>
        <p>Cadastre suas vagas de trabalho</p>
        <ProjectForm handleSubmit={createPost} btnText="Salvar" />
        </div>

    )
    
}
export default NewProject