import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home'
import NewProject from './components/pages/NewProject'
import Container from './components/layout/Container';
import Navbar from './components/layout/Navbar';
import Projects from './components/pages/Projects';
import Estatisticas from './components/Estatisticas';
import { useEffect, useState } from 'react';

function App() {
  
const [versao, setVersao] = useState(0);


useEffect(() => {
  setVersao((v) => v + 1);
    }, []);

  return (
    <Router>
      <Navbar/>
      <Container customClass="min_height">


    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route  path="/projects" element={<Projects />} />
      <Route  path="/estatisticas" element={<Estatisticas key={versao}/>} />
      <Route  path="/newproject" element={<NewProject />} />
      </Routes>


      </Container>
      </Router>

  );
}

export default App;
