import '../styles/shorts.css'
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from 'react'
import axios from 'axios';
import { URL } from '../code/Constants'
import { useDispatch } from 'react-redux'
import { Actions } from '../redux/countrySlice'

axios.defaults.withCredentials = true

export const Modal = ({children, redirect})=> {
  const navigate = useNavigate()
  function outerClose(ev) {
    if (ev.currentTarget === ev.target) {
      document.dispatchEvent(new Event('modal:close'))
      redirect && navigate(redirect)
    }
  }

  return (
  <div onClick={outerClose} className="_modal _flex-center modal">
    <div className="content">
      <p className="close-btn">X</p>
      { children }
    </div>
  </div>
  )
}

export const Loading = ({ show })=> {
  if (!show) return null
  return (
  <div className="_flex-center loading">
    <div className="loader-wraper">
      <div className="loader">
        <p className="loader loader-inner"></p>
      </div>
    </div>
  </div>
  )
}

export const Toast = ({ time = 2500 })=> {
  const [show, setShow] = useState(false)
  const [message, setMessage] = useState('')
  const dispatch = useDispatch()

  function showToast(ev) {
    setShow(true)
    setMessage(ev.detail)
    setTimeout(() => {
      setShow(false);
    }, time);
  }

  useEffect(()=> {
    axios.get(URL.local.check)
      .then(res=> dispatch(Actions.setAuth(res.data)))
      .catch(()=> dispatch(Actions.setAuth({ authenticated: false, user: null })))
    document.addEventListener('toast', showToast)
    return ()=> { document.removeEventListener('toast', showToast) }
  })
  return <span className={'toast' + (show ? ' show' : ' none')}>{message}</span>
}

export const Errors = ({ errors })=> {
  if (errors === null || !Object.keys(errors).length)
    return null
  if (typeof errors === 'string')
    return <div className="row errors"><p className='cell'></p><p className='cell'><i className="danger">!</i> {errors}</p></div>
  return Object.keys(errors).map((key)=>
    <div className='row errors' key={key}>
      <p className="cell"><i className="danger">!</i> { key }</p>
      <ul className="cell _font-300">
        { errors[key].map((error, index)=> <li key={index}>{ error }</li>) }
      </ul>
    </div>
  )
}