import { Link } from "react-router-dom"
import Container from './Container'
import styles from './Navbar.module.css'

function Navbar () {

    return (
   <nav className={styles.navbar}>
        <Container>

        <ul className={styles.list}>
          <li className={styles.item}>
         <Link to="/"> Home </Link>
          </li>

          <li className={styles.item}>
         <Link to="/Contact"> Contact </Link>
          </li>

          <li className={styles.item}>
         <Link to="/Estatisticas"> Estatísticas </Link>
          </li>

          <li className={styles.item}>
         <Link to="/Projects"> Projects </Link>
          </li>
        </ul>


          </Container>    
       </nav>

    )
}

export default Navbar