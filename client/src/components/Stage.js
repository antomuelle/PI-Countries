import { useEffect, useState } from 'react'
import { randomInt } from '../code/utils'
import '../styles/stage.css'

const PATH = '/images/boxes/'
const CHANGES = 2
const INTERVAL = 800
const img_count = 56
const positions = ['left','top','rigth','bottom']

function randomPos() { return positions[ randomInt(0,3) ] }
function fillArray(r, c) {
  const arr = []
  for (let i=1; i<=(r * c); i++)
    arr.push(randomInt(1, img_count))
  return arr
}

export default function Stage({ rows, cols}) {
  const [state, setState] = useState(fillArray(rows, cols))

  useEffect(()=> {
    const interval = setInterval(() => {
      setState((prev) => {
        for (let i=0; i<CHANGES; i++)
          prev[randomInt(1, (rows*cols)-1)] = randomInt(1, img_count)
        return [...prev]
      })
    }, INTERVAL);
    const rule = addCssClass('boxes > div', `width: ${100 / cols}%; height: ${100 / rows}%`)

    return ()=> {
      clearInterval(interval)
      document.styleSheets[0].deleteRule(rule)
    }
  }, [])// eslint-disable-line
  
  return (
  <div className='boxes'>
    {state.map((num, index)=> <Box key={index} num={num} />)}
  </div>
  )
}

function Box({num}) {
  const [state, setState] = useState({
    old: {src: '', class: randomPos()},
    current: {src: PATH+num+'.jpg', class: 'current'}
  })

  useEffect(()=> {
    if (state.old.class === 'current') {
      setState({
        old: {...state.old, class: randomPos()},
        current: {src:PATH+num+'.jpg', class:'current'}
      })
    }
    else {
      setState({
        old: {src:PATH+num+'.jpg', class:'current'},
        current: {...state.current, class:randomPos()}
      })
    }
  }, [num])// eslint-disable-line

  return (
    <div className='bg-box'>
      <div>
        <img src={state.old.src} className={state.old.class} alt="piece bg" />
        <img src={state.current.src} className={state.current.class} alt="piece bg" />
      </div>
    </div>
  )
}

function addCssClass(name, rule) {
  if (document.styleSheets.length > 0) {
    const style = document.styleSheets[0]
    return style.insertRule(`.${name} {${rule}}`)
  }
}