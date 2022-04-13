import React from 'react'
import './Home.css'
import Ticket from './../images/movie_tickets.jpg'

export default function HomeFunc(props) {

  return(
    <div className='text-center'>
          <h2>Welcome Home</h2>
        <hr />
          <img src={Ticket} alt="movie ticket" />
        <hr />
          <div className='tickets' />
      </div>
  )
}