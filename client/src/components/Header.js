import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { URL } from "../code/Constants";
import { Actions } from "../redux/countrySlice";
import SearchBar from "./SearchBar";

export default function Header() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const authenticated = useSelector((state)=> state.country.authenticated)
  const user = useSelector((state)=> state.country.user)
  const countries = useSelector((state)=> state.country.countries)

  async function logout() {
    await axios.get(URL.local.logout)
    dispatch(Actions.setAuth(false))
  }

  async function onFound(text, data) {
    if (data) navigate(data.id)
    else {
      try {
        console.log(countries)
        const {data} = await axios.get(URL.local.search, {params: { name: text }})
        dispatch(Actions.setCountriesData([data.rows, data.count]))
        navigate('/home')
      }
      catch (error) {console.log(error)}
    }
  }

  return (
  <div className="header">
    <div className="_limiter _flex _100h">
      <Link to="/" className="brand">
        <img src="/images/logo.png" alt="logo web" />
        <span>COUNTRIES PI</span>
      </Link>
      <div className="_flex _items-center">
        <SearchBar config={{maxSuggests: 20, onSubmit: onFound}} />
        <div className="user">
          <div className="avatar"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="#3273dc" d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0S96 57.3 96 128s57.3 128 128 128zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg></div>
          <div className="opts">
            {authenticated ? <><span>{user.username}</span><p onClick={logout}>Logout</p></> : <Link to="/login">Login</Link>}
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}