import '../styles/searchBar.css'
import { useRef, useState } from 'react'
import axios from 'axios'
import { URL } from '../code/Constants'
import { Loading } from './Shorts'

const search_img = 'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGNSURBVDhPrdTLK0RhGMfxcRl3mZAMQmKBlBUbK/kzZGFpJVEWFi7JwkqS0hCJpY17smBnL1FIiSLkssBY8P1Ng9J53snwq0+nc5rzzHt53pPgix39Jg2F0asfz3jEFX6dWnRgGed4gQptohP6o68kRa9W6jGKNoShohs4Qw1aUYlDxBxtMdZwjT6oQA5SkYkSDOMdC8iHmRQM4R4DSIaVEbyiG4l64JVSaI1OkacHjmgm+1hF0Kqo6ZRjB7d64MgD1qH1DlgFtUYZuIjcufOGOxTAbxW8gfqsKHLnTjpyoZYKWwU1sks0I1sPHAmiEUd4co1wF9qQHmjXvaKT0w41v/pT75mpwjG06F34OdIsqD+1aUuohudR1qjV/SFoHdU66rMTzKEfU9AU1acrqIMZjWwMOiHzKEMvtnEALb6O2hYGoTU0E8Ai1AaT+NxljVrN3oAWNEG96vwWqNgMNI0JaNrWpjmjlzTNaaiYiqqv4o7Ooj5R2q1ZaKR/iqa2h3Go+L+kAioW15p9x+f7AKO3UBH1m2r+AAAAAElFTkSuQmCC'

const def_setup = {
  delay: 400,
  minOpenLen: 2,
  maxSuggests: 0,
  maxHeight: 0,
  autoHighlight: false,
  showButton: true,
  onSubmit: null
}

const mergeObj = (def, plus)=> {
  const merged = {}
  for (const key in def) {
    merged[key] = plus[key] ?? def[key]
  }
  return merged
}

export default function SearchBar({config = {}}) {

  const setup = useRef(mergeObj(def_setup, config))
  const [state, setState] = useState({
    input: '',
    focused: false,
    pointed: setup.current.autoHighlight ? 0 : -1,
    loading: false
  })
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const timer = useRef(0)

  async function onKeyDown(ev) {
    if (ev.code === 'ArrowDown') {
      let index = state.pointed + 1
      index >= suggestions.length && (index = 0)
      setPointed(index)
      moveView(index + 1)
    }
    else if (ev.code === 'ArrowUp') {
      let index = state.pointed - 1
      index < 0 && (index = suggestions.length - 1)
      setPointed(index)
      moveView(index + 1)
    }
    else if (ev.code === 'Enter') {
      submitSelection()
      setTimeout(() => { ev.target.select() }, 100);
    }
  }

  function setPointed(index) { setState({ ...state, pointed: index }) }
  function moveView(index) {
    if (suggestions.length < 1) return
    document.querySelector('.suggest li:nth-child('+index+')').scrollIntoView(false)
  }
  function submitSelection() {
    if (!setup.current.onSubmit) return
    // si no hay sugerencias, se envia el texto ingresado
    if (state.pointed < 0) {
      if (state.input.length > 0)
        setup.current.onSubmit(state.input)
    } else {
      const suggest = suggestions[state.pointed]
      setState({ ...state, input: suggest.name, pointed: -1 })
      setup.current.onSubmit(suggest.name, suggest)
    }
    setSuggestions([])
  }

  function onChange(ev) {
    const value = ev.target.value
    setState({ ...state, input: value, pointed: -1 })
    if (value.length >= setup.current.minOpenLen) {
      clearTimeout(timer.current)
      timer.current = setTimeout(async () => {
        setLoading(true)
        setSuggestions(await request(value))
        setLoading(false)
      }, setup.current.delay);
    } else {
      setSuggestions([])
    }
  }

  function onFocus(ev) {
    if (!ev.currentTarget.contains(ev.relatedTarget)) {
      setState({ ...state, focused: ev.type === 'focus' })
      ev.type === 'focus' && ev.target.select()
    }
  }

  const request = async (value)=> {
    try {
      const params = { name: value }
      setup.current.maxSuggests && (params.limit = setup.current.maxSuggests)
      const { data } = await axios.get(URL.local.search, { params })
      if (!data.count || data.count === 0) return []
      const max = setup.current.maxSuggests
      if (max > 0 && data.rows.length > max)
        return data.rows.slice(0, max)
      return data.rows
    }
    catch (error) { return [] }
  }

  return (
  <div className="search-bar" onFocus={onFocus} onBlur={onFocus}>
    <div className="wrapper">
      <div className="waiting"><Loading show={loading} /></div>
      <input onKeyDown={onKeyDown}
        onChange={onChange}
        value={state.input} type="text" className="_input" placeholder='Search' />
      <Suggest
        value={state.input}
        show={state.focused}
        suggestions={suggestions}
        pointed={state.pointed}
        setPointed={setPointed}
        submitSelection={submitSelection}
        maxSuggests={setup.current.maxSuggests} />
    </div>
    {setup.current.showButton && <button onClick={submitSelection} className="_button _blue"><img src={search_img} alt="meme" /></button>}
  </div>
  )
}

function Suggest({ show, value, suggestions, pointed, setPointed, maxSuggests, submitSelection }) {
  if (!show || !suggestions.length) return null
  const lis = []
  for (let i=0; i<(Math.min(suggestions.length, maxSuggests)); i++)
    lis[i] = <li
      key={i}
      onMouseOver={()=> setPointed(i)}
      onClick={submitSelection}
      className={i===pointed?'pointed':null} >{highlight(suggestions[i].name, value)}</li>

  return (
  <div className='suggest' tabIndex='2'>
    { lis }
  </div>
  )
}

function highlight(text, value) {
  if (!value) return text
  const index = text.toLowerCase().indexOf(value.toLowerCase())
  if (index < 0) return text
  return <span>
    {text.slice(0, index)}
    <span className='highlight'>{text.slice(index, index+value.length)}</span>
    {text.slice(index+value.length)}
  </span>
}