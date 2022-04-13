import React, { Component } from 'react';
import './Home.css'
import Ticket from './../images/movie_tickets.jpg'

export default class Home extends Component {

  render() {
    // there's just two ways to put images in here don't worry about it
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
}