import { useState } from "react"
import { useDispatch } from "react-redux"
import { useOnMounted, useOnUpdate } from "../code/utils"

export default function Paginator({ results, init = 1, rows = 3, cols = 4, sides = 2, onPageChanged = null, action = null }) {
  const [current, setCurrent] = useState(init)
  const dispatch = useDispatch()
  const per_page = rows * cols
  const total_pages = Math.ceil(results / per_page)
  const mounted = useOnMounted(()=> {
    // if (action)
    //   return ()=> { setCurrent((value)=> { dispatch(action(value)); return value }) }
  })
  useOnUpdate(()=> {
    if ((current - 1) * per_page > results) return setPage(total_pages)
    onPageChanged && onPageChanged(current)
  }, [rows, cols, current], mounted)
  useOnUpdate(()=> { setPage(init) }, [init], mounted)

  function indexes() {
    const indexes = []
    for (let i = Math.max(1, current - sides); i <= Math.min(total_pages, current + sides); i++)
      indexes.push(i)
    return indexes
  }
  function changePage(ev) { setPage(parseInt(ev.target.textContent)) }
  function setPage(page) {
    if (page === current) return
    console.log('not same, setting')
    setCurrent(page)
    action && dispatch(action(page))
  }

  return (
  <div className="pagis">
    {(current > 1) && <span onClick={()=> setPage(current - 1)}>&lt;</span>}
    {(current > sides + 1) && <>
      <span onClick={changePage}>1</span><span className="dots">...</span></>}
    {indexes().map(i=> <span key={i} onClick={changePage} className={i === current ? 'active' : null}>{i}</span>)}
    {(current < total_pages - sides) && <><span className="dots">...</span><span onClick={changePage}>{ total_pages }</span></>}
    {(current < total_pages) && <span onClick={()=> setPage(current + 1)}>&gt;</span>}
  </div>
  )
}