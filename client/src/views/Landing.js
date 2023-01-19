import '../styles/landing.css'
import { Link, Outlet } from "react-router-dom";
import Stage from '../components/Stage'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { URL } from '../code/Constants';
import { Actions } from '../redux/countrySlice';

export default function Landing() {

  const logged = useSelector(state => state.country.authenticated)
  const dispatch = useDispatch()

  async function logout() {
    await axios.get(URL.local.logout)
    dispatch(Actions.setAuthenticated(false))
  }

  return (<>
  <Stage rows={4} cols={4} />
  <div className="_flex-center landing">
    <div className='_text-center'>
      <img src='/images/henry-logo_alpha.png' alt="logo henry" className='logo-henry' />
      <h2 className='title'>COUNTRIES</h2>
      <p className='subtitle'>Individual Project {logged || 'false'}</p>
      <div className='_my-2 _pr-1'>
        <p>This is a small introduction to our website.</p>
        <p>You are currently on the "Landing page"<br />
        Please click the following link to enter the application or login,<br /> you can also create a new account</p>
      </div>
      <div className='_text-center _mb-2'>
        <p><Link to='/home' className='_button enter-home'>Walk In</Link></p>
        {logged ?
          <span onClick={logout} className='land-btn'>Logout</span> :
          <><Link to='/login' className='land-btn'>Login</Link>
            <Link to='/login/register' className='land-btn'>Sign Up</Link></>}
      </div>
    </div>
  </div>
  <Outlet />
  </>)
}