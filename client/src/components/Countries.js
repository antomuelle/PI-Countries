import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { URL } from "../code/Constants"
import { useOnMounted, useOnUpdate } from "../code/utils"
import { Actions } from "../redux/countrySlice"
import Paginator from "./Paginator"

const SIDES = 2
const ascendent = (a, b) => a.name > b.name ? 1 : -1
const descendent = (a, b) => a.name < b.name ? 1 : -1

export default function Countries() {
  const dispatch = useDispatch()
  const countries = useSelector(state => state.country.countries)
  const continents = useSelector(state => state.country.continents)
  const activities = useSelector(state => state.country.activities)
  const per_page = countries.rows * countries.cols

  const mounted = useOnMounted(()=> {
    !countries.data.length && getCountries()
    !continents.length && axios.get(URL.local.continents).then(res => dispatch(Actions.setContinents(res.data)))
    !activities.length && axios.get(URL.local.activities).then(res => dispatch(Actions.setActivities(res.data)))
  })
  useOnUpdate(()=> {
    getCountries()
  }, [countries.f_continent, countries.f_activity], mounted)

  async function getCountries(page = 1) {
    try {
      const params = {
        limit: per_page,
        offset: (page - 1) * per_page
      }
      // si no incluye '' y 'all' es porque se seleccionó un continente o actividad
      if (!['', 'all'].includes(countries.f_continent)) { params.continent = countries.f_continent }
      if (!['', 'all'].includes(countries.f_activity)) { params.activity = countries.f_activity }
      const res = await axios.get(URL.local.search, { params })
      filter(res.data.rows)
      dispatch(Actions.setCountries({...countries, data: res.data.rows, total: res.data.count}))
    }
    catch (err) {
      dispatch(Actions.setErrors(err.response.data.errors))
      dispatch(Actions.setCountries({...countries, data: [], total: 0}))
    }
  }
  function input(ev) { dispatch(Actions.setCountries({...countries, [ev.target.name]: parseInt(ev.target.value)})) }
  function onPageChanged(page) { getCountries(page) }
  function onSelect(ev) {
    const method = ev.target.value
    let copy = [...countries.data]
    filter(copy, method)
    dispatch(Actions.setCountries({ ...countries, f_order: method, data: copy }))
  }
  function filterContinent(ev) {
    dispatch(Actions.setCountries({...countries, f_continent: ev.target.value, current: 1}))
  }
  function filterActivity(ev) {
    dispatch(Actions.setCountries({...countries, f_activity: ev.target.value, current: 1}))
  }
  function filter(copy, method = null) {
    if (method === null) method = countries.f_order
    if (method === '') return copy
    if (method === 'asc') copy.sort(ascendent)
    else if (method === 'desc') copy.sort(descendent)
    return copy
  }

  return (
  <div className="countries">
    <div className="envelope">
      <div className="controls">
        <div className="per-page">
          <label>Rows: <input onChange={input} type="number" name="rows" value={countries.rows} className="_input" /></label>
          <label>Cols: <input onChange={input} type="number" name="cols" value={countries.cols} className="_input" /></label>
        </div>
        <div className="right-flex">
          <select onChange={filterActivity} value={countries.f_activity} name="f_activity" className="_input">
            <option disabled value="">Activity</option>
            <option value="all">All</option>
            { activities.map(activity => <option key={activity.id} value={activity.id}>{activity.name}</option>) }
          </select>
          <select onChange={filterContinent} value={countries.f_continent} name="f_continent" className="_input">
            <option disabled value="">Continent</option>
            <option value="all">All</option>
            { continents.map(continent => <option key={continent.id} value={continent.id}>{continent.name}</option>) }
          </select>
          <select onChange={onSelect} value={countries.f_order} name="f_order" className="_input">
            <option disabled value="">Order</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
      <Paginator results={countries.total} onPageChanged={onPageChanged} init={countries.current} action={Actions.setCurrentPage} cols={countries.cols} rows={countries.rows} sides={SIDES} />
    </div>
    <div className="_columns cards">
      { countries.data.map(country => <Card key={country.name} country={country} cols={countries.cols} />) }
    </div>
  </div>
  )
}

function Card({ country, cols }) {

  return (
  <div className="_column card split" style={{width: `calc(${100 / cols}% - 10px)`}}>
    <Link to={country.id} className="wrapper">
      <div className="_ratio _4-3 _imghover _scale">
        <p className="decor"></p>
        <img src={country.image} alt="tit men" /></div>
      <div className="text">
        <p className="_font-500">{ country.name }</p>
        <p>{country.continent}</p>
      </div>
    </Link>
  </div>
  )
}