import { createBrowserRouter, Outlet } from 'react-router-dom'
import Home from './views/Home'
import Landing from './views/Landing'
import Login from './components/Login'
import Register from './components/Register'
import { Modal } from './components/Shorts'
import ErrorPage from './views/ErrorPage'
import Countries from './components/Countries'
import Country from './components/Country'
import Activities from './components/Activities'
import NewActivity from './components/NewActivity'

export default createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
    errorElement: <ErrorPage />,
    children: [
      {
        path:'login',
        element: <Modal redirect="/"><Outlet /></Modal>,
        children: [
          { index: true, element: <Login /> },
          { path: 'register', element: <Register /> }
        ]
      }
    ]
  },
  {
    path: '/home',
    element: <Home />,
    children: [
      { index: true, element: <Countries /> },
      { path: 'activities', element: <Activities />, children: [
        { path: 'new', element: <Modal redirect="/home/activities"><NewActivity /></Modal>}
      ]},
      { path: 'languages', element: <div>Languages</div> },
      { path: 'currencies', element: <div>Currencies</div> },
      { path: ':id', element: <Country /> }
    ]
  }
])