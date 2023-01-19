import axios from 'axios'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { URL } from '../code/Constants'
import { showToast, sleep, stateUpdater } from '../code/utils'
import { validator } from '../code/validator'
import { Actions } from '../redux/countrySlice'
import '../styles/new-activity.css'
import SearchBar from './SearchBar'
import { Errors, Loading } from './Shorts'

export default function NewActivity() {
  const [state, setState] = useState({
    name: '',
    difficulty: '',
    duration: '',
    season: '',
    countries: [],
    errors: null,
    loading: false
  })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const updater = stateUpdater(state, setState)

  function model(prop, ev) { updater(prop, ev.target.value) }
  function onFound(_, data) {
    if (!data) return
    setState((old) => {
      for (let i=0; i<old.countries.length; i++) {
        if (old.countries[i].id === data.id) {
          showToast('Country already added')
          return old
        }
      }
      return {...old, countries: [...old.countries, data]}
    })
  }
  function deleteCountry(id) {
    setState((old) => {
      const countries = old.countries.filter(c => c.id !== id)
      return {...old, countries}
    })
  }

  async function onSubmit(ev) {
    ev.preventDefault()
    validator.validate(state, {
      name: 'string|not_empty|min:4',
      difficulty: 'numeric|not_empty|min:1|max:5',
      duration: 'numeric|not_empty|min:1',
      season: 'string|not_empty|in:summer,autumn,winter,spring',
      countries: 'array|not_empty'
    })
    if (!validator.pass) return updater('errors', validator.errors)
    updater('errors', null)
    updater('loading', true)
    await sleep(500)
    try {
      const {data} = await axios.post(URL.local.activities, {
        name: state.name,
        difficulty: state.difficulty,
        duration: state.duration,
        season: state.season,
        countries: state.countries.map(c => c.id)
      })
      showToast('Activity created')
      dispatch(Actions.addActivity(data))
      setState({name: '',difficulty: '',duration: '',season: '',countries: [],errors: null,loading: false})
      navigate('/home/activities')
    }
    catch (err) {
      err.response ?
        updater('errors', err.response.data.message) :
        updater('errors', 'Error creating activity')
      updater('loading', false)
    }
  }

  return (
  <div className="new-activity">
    <Loading show={state.loading} />
    <h4 className="_line-height-1 _mb-1">Create new activity</h4>
    <form onSubmit={onSubmit} className="tabulated">
      <label className="row">
        <div className="cell text">Name: </div>
        <div className="cell">
          <input onChange={(ev)=> model('name', ev)} value={state.name} type="text" className="_input input" required placeholder="Name of the activity" />
        </div>
      </label>
      <label className="row">
        <div className="cell text">Difficulty: </div>
        <div className="cell">
          <input onChange={(ev)=> model('difficulty', ev)} value={state.difficulty} type="number" min="1" max="5" className="_input input" required placeholder="A number between 1 and 5" />
        </div>
      </label>
      <label className="row">
        <div className="cell text">Duration: </div>
        <div className="cell">
          <input onChange={(ev)=> model('duration', ev)} value={state.duration} type="number" className="_input input" required placeholder="How long in minutes" />
        </div>
      </label>
      <label className="row">
        <div className="cell text">Season: </div>
        <div className="cell">
          <select onChange={(ev)=> updater('season', ev.target.value)} value={state.season} className='_select input' required>
            <option value="" disabled>Choose a season</option>
            <option value="summer">Summer</option>
            <option value="autumn">Autumn</option>
            <option value="winter">Winter</option>
            <option value="spring">Spring</option>
          </select>
        </div>
      </label>
      <div className='row at-end'>
        <p className='cell'></p>
        <p className="cell _text-right">
          <input type="submit" value='Send' className='_button _orange-3 _mr-0.5' />
          <input type="reset" value='Cancel' className='_button _gray-4' />
        </p>
      </div>
    </form>
    <div className="tabulated">
      <label className="row">
        <div className="cell text">Countries</div>
        <div className="cell"><SearchBar config={{maxSuggests: 10, onSubmit: onFound}} /></div>
      </label>
    </div>
    <div className="tabulated"><Errors errors={state.errors} /></div>
    <div className="mini-card">
      {state.countries.map(country => <p key={country.id}>{country.name}<i onClick={()=> deleteCountry(country.id)}>x</i></p>)}
    </div>
  </div>
  )
}