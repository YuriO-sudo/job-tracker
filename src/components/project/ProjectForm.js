import { useEffect, useState } from 'react'

import Input from '../form/Input'

import SubmitButton from '../form/SubmitButton'
import styles from './ProjectForm.module.css'

function ProjectForm ({ handleSubmit, btnText, projectData} ) {
    const [status, setstatus] = useState([])
    const [project, setProject] = useState(projectData || {})

    useEffect ( () => {
        // fetch('http://localhost:3002/status', {
            fetch('http://localhost:3000/status', {
        method: 'GET',
        headers :{
            'Content-Type': 'application/json',
            },
    }).then((resp) => resp.json())
    .then((data) => {
        setstatus(data)
    })
    .catch((err) => console.log(err))
    }, [])

    const submit = (e) => {
        e.preventDefault()
        handleSubmit(project)
    }

    function handleChange(e) {
        setProject({ ...project, [e.target.name]: e.target.value})
        // console.log('name =>:', e.target.name, '| value:', e.target.value)
        console.log('salario => :', e.target.salario_min, '| value:', e.target.value)
    }

    // function handleCategory(e) {
    //     setProject({ ...project, status: {
    //         id: e.target.value,
    //         name: e.target.options[e.target.selectedIndex].text,
    //     }
    //     })
    // }

    return (
        <form onSubmit={submit} className={styles.form}>
                <Input 
                type="text"
                name="empresa"
                text="Nome da empresa" 
                placeholder="Insira o nome da empresa"
                handleOnChange={handleChange}
                value={project.empresa ? project.empresa : ''}
                />

                <Input 
                type="text"
                name="cargo"
                text="Cargo" 
                placeholder="Insira o cargo"
                handleOnChange={handleChange}
                value={project.cargo ? project.cargo : ''}
                />

                <Input 
                type="text" 
                name="local"
                text="Informe o local"
                placeholder="Insira o local"
                handleOnChange={handleChange}
                value={project.local ? project.local : ''}
                />

                <Input 
                type="text" 
                name="modalidade"
                text="modalidade da vaga"
                placeholder="Informe a modalidade da vaga"
                handleOnChange={handleChange}
                value={project.modalidade ? project.modalidade : ''}
                />


                <Input 
                type="text" 
                name="nivel"
                text="nível da vaga"
                placeholder="Informe o nível da vaga"
                handleOnChange={handleChange}
                value={project.nivel ? project.nivel : ''}
                />

                <Input 
                type="text" 
                name="salarioMin"
                text="salário da vaga"
                placeholder="Insira o salário da vaga"
                handleOnChange={handleChange}
                value={project.salarioMin ? project.salarioMin : ''}
                />

                <Input 
                type="text"
                name="link"
                text="link" 
                placeholder="Insira o link da empresa ou da vaga"
                handleOnChange={handleChange}
                value={project.link ? project.link : ''}
                />

                <Input 
                type="text"
                name="descricao"
                text="descricao" 
                placeholder="Insira a descrição da empresa ou da vaga"
                handleOnChange={handleChange}
                value={project.descricao ? project.descricao : ''}
                />

                <Input 
                type="text"
                name="observacoes"
                text="observacoes" 
                placeholder="Insira alguma observação sobre a empresa ou a vaga"
                handleOnChange={handleChange}
                value={project.observacoes ? project.observacoes : ''}
                />


            <SubmitButton text={btnText}/>

        </form>
    )

}

export default ProjectForm