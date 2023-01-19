import '../styles/error-page.css'

export default function ErrorPage() {

  return (
  <div className="not-found">
    <div className="_limiter _flex-center">
      <div><img src="/images/disconnected.png" alt="disconnected" /></div>
      <div className='oops'>
        <p>OOPS!</p>
        <p>PAGE NOT FOUND</p>
        <p>404</p>
      </div>
    </div>
  </div>
  )
}