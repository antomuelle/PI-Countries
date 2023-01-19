import '../styles/country.css'
import axios from "axios"
import { useParams } from "react-router-dom"
import { URL } from "../code/Constants"
import { useOnMounted } from "../code/utils"
import { useState } from 'react'

const formater = new Intl.NumberFormat().format

export default function Country(props) {
  const { id } = useParams()
  const [country, setCountry] = useState({})
  useOnMounted(()=> {
    axios.get(URL.local.search + '/' + id).then(res => setCountry(res.data))
  })

  return (
  <div className="country">
    <div className="_columns">
      <div className="_column">
        <img src={country.image} alt={country.name} className="flag" />
        <h2>{ country.name }</h2>
        <p className='_medium'>{ country.continent }</p>
        <div className="row">
          <span>Capital</span>
          <span>{ country.capital }</span></div>
        <div className="row">
          <span>Official name</span>
          <span>{ country.official_name }</span></div>
        <div className="row">
          <span>Subregion</span>
          <span>{ country.subregion }</span></div>
        <div className="row">
          <span>Population</span>
          <span>{ formater(country.population) }</span></div>
        <div className="row">
          <span>Area</span>
          <span>{ formater(country.area) } km2</span></div>
        <div className="ulist">
          <p>Languages</p>
          <div>{country.languages?.map(lan=> <p key={lan.code}>{lan.name}</p>)}</div>
        </div>
        <div className="ulist">
          <p>Currencies</p>
          <div>{country.currencies?.map(cur=> <p key={cur.code}>{cur.code} {cur.name} [{cur.symbol}]</p>)}</div>
        </div>
      </div>
      <div className="_column">
        <div className="tourism">
          <h3>Tourist activities</h3>
          {country.activities?.map(act=>
          <div key={act.id} className="row">
            <h4>{act.name}</h4>
            <p><b>Difficulty: </b>{act.difficulty} / 5</p>
            <p><b>Season: </b>{act.season}</p>
            <p><b>Duration: </b>{act.duration} minutes</p>
          </div>)}
        </div>
      </div>
    </div>
  </div>
  )
}