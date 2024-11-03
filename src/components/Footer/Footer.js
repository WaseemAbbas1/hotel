import React from 'react'

export default function Footer() {
 let nowYear = new Date().getFullYear();
  return (
    <footer>
      <div className="container py-2">
        <div className="row">
          <div className="col">
            <p className='mb-0 text-center'>&copy; {nowYear}. All right reserved</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
