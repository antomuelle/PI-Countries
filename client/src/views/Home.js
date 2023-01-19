import '../styles/home.css'
import Header from "../components/Header";
import { Link, Outlet } from 'react-router-dom';
import { useState } from 'react';

const TABS = [
  { label: 'Countries', path: '' },
  { label: 'Activities', path: 'activities' },
  { label: 'Languages', path: 'languages' },
  { label: 'Currencies', path: 'currencies' },
]

export default function Home() {
  const [selected, setSelected] = useState(0)
  // selectTab es una función que se ejecuta cuando se hace click en un tab
  function selectTab(ev) {
    const index = TABS.findIndex(tab=> tab.label === ev.target.innerText)
    setSelected(index)
  }
  
  return (
  <div className="home">
    <img className='bg-cover' src="/images/back_6.jpg" alt="one move" />
    <Header />
    <div className="main">
      <div className="_limiter _100h">

        <div className="_100h tab-panel">
          <ul className="tabbed">
            { TABS.map((tab, i)=> <li key={tab.label}><Link className={i===selected?'active':null} onClick={selectTab} to={tab.path}>{tab.label}</Link></li>) }
          </ul>
          <div className="tab-content">
            <Outlet />
          </div>
        </div>
        
      </div>
    </div>

    <footer>
      <div className="_limiter _text-center">
        CopyRight &copy; 2023 by Antonio Muelle.
      </div>
    </footer>
  </div>
  )
}