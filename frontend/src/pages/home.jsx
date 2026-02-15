import { useState } from 'react'
// import reactLogo from '../assets/react.svg'
// import viteLogo from '/vite.svg'
import './style.css'

import cliente from '../assets/client.png'
import workbench from '../assets/workbench.png'
import hairBeard from '../assets/hair_beard.png'


function Home() {
  const [count, setCount] = useState()

  return (

    <div className='container'>
      <section className='hero-section'>
        <h4>ESTILO & ELEGÂNCIA</h4>
        <h1>💈Urban Cut💈</h1>
        <p>A arte de cuidar do seu visual com excelência. <br />
          Profissionalismo, qualidadee e estilo em cada atendimento.
        </p>
        <button>AGENDAR HORÁRIO</button>
      </section>  

      <section className='services'>
        <h4 className='our-services'>Nossos Serviços</h4>
        <h2>Qualidade Premium</h2>
        <div className="card-hero-slider">
          <div className='hero-slider'>
            <img src={cliente} alt="Corte Masculino" />
            <h4>Corte Masculino</h4>
            <div className="price-container">
              <span className='price'>R$ 30</span>
              <span className='time'>10 min</span>
            </div>
          </div>
  
          <div className="hero-slider">
            <img src={workbench} alt="Barba" />
            <h4>Barba</h4>
            <div className="price-container">
              <span className='price'>R$ 12</span>
              <span className='time'>5 min</span>
            </div>
          </div>
  
          <div className="hero-slider">
            <img src={hairBeard} alt="Corte + Barba" />
            <h4>Sobrancelha</h4>
            <div className="price-container">
              <span className='price'>R$ 20</span>
              <span className='time'>5 min</span>
            </div>
          </div>
        </div>
      </section>

      <section className='feature-section'>
        <div className='feature-card'>
          <div className="circle">
            <i className='fas fa-clock'></i>
            </div>
          <h4>Horário flexível</h4>
          <p>Seg-Sáb: 09h - 19h</p>
        </div>

        <div className="feature-card">
          <div className="circle">
            <i className="fas fa-award"></i>
            </div>
          <h4>Profissional Qualificado</h4>
          <p>Barbeiro experiente e qualificado</p>
        </div>

        <div className="feature-card">
          <div className="circle">
            <i className='fa-solid fa-scissors'></i>
          </div>
          <h4>Equipamentos Premium</h4>
          <p>Ferramentas de alta qualidade</p>
        </div>

        <div className="feature-card">
          <div className="circle">
            <i className="fa-solid fa-location-dot"></i>
          </div>
          <h4>Localização Central</h4>
          <p>Fácil acesso</p>
        </div>
      </section>

      <article className='end-page'>
        <h2>Pronto para transformar seu visual?</h2>
        <p>Agende seu horario e experimente o melhor serviço de barbearia da cidade</p>
        <button>FAZER ATENDIMENTO</button>
      </article>

      <hr className='separator'/>
      <footer>
        <div className="footer-section">
          <h3>Urban Cut</h3>
          <p>Estilo & Elegancia since 2024</p>
        </div>
        <a href="#">Área do Administrador</a>
      </footer>

    </div>
  )
}

export default Home
