import '../styles/login-register.css'
import axios from 'axios'
import { useState } from 'react'
import { showToast, sleep, stateUpdater } from '../code/utils'
import { validator } from '../code/validator'
import { Loading, Errors } from './Shorts'
import { URL } from '../code/Constants'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [state, setState] = useState({
    username: '',
    password: '',
    loading: false,
    toast: '',
    errors: null
  })
  const updater = stateUpdater(state, setState)
  const navigate = useNavigate()

  function model(prop, ev) { updater(prop, ev.target.value) }

  async function onSubmit(ev) {
    ev.preventDefault()
    validator.validate(state, {
      username: 'string|not_empty|not_space|min:4',
      password: 'string|not_empty|not_space|min:4'
    })
    if (!validator.pass)
      return updater('errors', validator.errors)
    
    updater('loading', true)
    updater('errors', null)
    await sleep(500)
    try {
      const {data} = await axios.post(URL.local.login, {username: state.username, password: state.password })
      console.log(data)
      showToast('Session iniciada')
      navigate('/home')
    }
    catch (error) {
      updater('loading', false)
      if (error.response) {
        if (error.response.status === 400)
          updater('errors', error.response.data.message || 'bad request')
        else if (error.response.status === 401)
          updater('errors', 'invalid username or password')
        else if (error.response.status === 301) {
          showToast(error.response.data.message)
          navigate('/home')
        }
        else
          updater('errors', 'unknow error')
      }
      else updater('errors', 'network error')
    }
  }

  return (
  <div>
    <Loading show={state.loading} />
    <h4 className='_line-height-1 _text-orange-2 _mb-1'>Iniciar Session</h4>
    <form onSubmit={onSubmit} className="tabulated">
      <label className="row">
        <div className="cell text">Usuario: </div>
        <div className="cell">
          <input onChange={(ev)=> model('username', ev)} value={state.username} type="text" className='_input input' required placeholder='usuario' />
        </div>
      </label>
      <label className="row">
        <div className="cell text">Contraseña: </div>
        <div className="cell">
          <input onChange={(ev)=> model('password', ev)} value={state.password} type="password" className='_input input' required placeholder='******' />
        </div>
      </label>
      <Errors errors={state.errors}></Errors>
      <div className='row'>
        <p className='cell'></p>
        <p className="cell _text-right">
          <input type="submit" value='Enviar' className='_button _orange-3 _mr-0.5' />
          <input type="reset" value='Cancelar' className='_button _gray-4' />
          </p>
      </div>
    </form>
  </div>
  )
}