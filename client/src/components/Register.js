import '../styles/login-register.css'
import axios from 'axios'
import { useState } from 'react'
import { showToast, sleep, stateUpdater } from '../code/utils'
import { validator } from '../code/validator'
import { Loading, Errors } from './Shorts'
import { URL } from '../code/Constants'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Actions } from '../redux/countrySlice'

export default function Register() {
  const [state, setState] = useState({
    names: '',
    username: '',
    email: '',
    password: '',
    repeat_password: '',
    loading: false,
    toast: '',
    errors: null
  })
  const updater = stateUpdater(state, setState)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  function model(prop, ev) { updater(prop, ev.target.value) }
  async function onSubmit(ev) {
    ev.preventDefault()
    validator.validate(state, {
      names: 'string|not_empty|min:4',
      username: 'string|not_empty|not_space|min:4',
      email: 'string|email|not_empty|not_space|min:7',
      password: 'string|not_empty|not_space|min:4',
    })
    if (state.password !== state.repeat_password) {
      if (!validator.errors) validator.errors = {}
      if (!validator.errors.password) validator.errors.password = []
      validator.errors.password.push('the passwords does not match')
      validator.pass = false
    }
    if (!validator.pass)
      return updater('errors', validator.errors)
    
    updater('loading', true)
    updater('errors', null)
    await sleep(500)
    try {
      await axios.post(URL.local.register, {
        names: state.names,
        username: state.username,
        email: state.email,
        password: state.password
      })
      dispatch(Actions.setAuthenticated(true))
      showToast('Usuario creado')
      navigate('/home')
    }
    catch (error) {
      updater('loading', false)
      if (error.response) {
        if (error.response.status >= 400)
          updater('errors', error.response.data.message)
        else if (error.response.status === 301)
          showToast(error.response.data.message)
        else
          updater('errors', 'unknow error')
      }
      else updater('errors', 'network error')
    }
  }

  return (
    <div>
    <Loading show={state.loading} />
    <h4 className='_line-height-1 _text-orange-2 _mb-1'>Nuevo Usuario</h4>
    <form onSubmit={onSubmit} className="tabulated">
    <label className="row">
        <div className="cell text">Name: </div>
        <div className="cell">
          <input onChange={(ev)=> model('names', ev)} value={state.names} type="text" className='_input input' required placeholder='Your name' />
        </div>
      </label>
      <label className="row">
        <div className="cell text">User: </div>
        <div className="cell">
          <input onChange={(ev)=> model('username', ev)} value={state.username} type="text" className='_input input' required placeholder='An username' />
        </div>
      </label>
      <label className="row">
        <div className="cell text">Email: </div>
        <div className="cell">
          <input onChange={(ev)=> model('email', ev)} value={state.email} name='email' type="email" className='_input input' required placeholder='Your email' />
        </div>
      </label>
      <label className="row">
        <div className="cell text">Password: </div>
        <div className="cell">
          <input onChange={(ev)=> model('password', ev)} value={state.password} type="password" className='_input input' required placeholder='A secure password' />
        </div>
      </label>
      <label className="row">
        <div className="cell text cell-vertical">Repeat password: </div>
        <div className="cell">
          <input onChange={(ev)=> model('repeat_password', ev)} value={state.repeat_password} type="password" className='_input input' required placeholder='Your password again' />
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