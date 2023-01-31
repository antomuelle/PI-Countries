import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Outlet } from 'react-router-dom'
import { URL } from '../code/Constants'
import { useOnMounted } from '../code/utils'
import { Actions } from '../redux/countrySlice'
import '../styles/activities.css'

export default function Activities() {
  const dispatch = useDispatch()
  const activities = useSelector(state => state.country.activities)
  useOnMounted(()=> {
    !activities.length && getActivities()
  })
  async function getActivities() {
    try {
      const res = await axios.get(URL.local.activities)
      dispatch(Actions.setActivities(res.data))
    }
    catch (err) { dispatch(Actions.setErrors(err.response.data.errors)) }
  }
  
  return (
  <div className="activities">
    <div className="_ratio">
      <h2>Activities</h2>
      <Link to="new" className="add-entity">+</Link>
    </div>
    <table className='_table'>
      <thead>
        <tr><th>ID</th><th>Name</th><th>Difficulty</th><th>Duration</th><th>Season</th><th>Countries</th></tr>
      </thead>
      <tbody>
        {activities?.map(a => (
          <tr key={a.id}>
            <td>{a.id}</td>
            <td>{a.name}</td>
            <td>{a.difficulty}</td>
            <td>{a.duration}</td>
            <td>{a.season}</td>
            <td>{a.countries?.map(c => c.name).join(', ')}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <Outlet />
  </div>
  )
}