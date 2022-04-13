import React, { useEffect, useState, Fragment } from 'react';
import { Link } from 'react-router-dom';

export default function AdminFunc(props) {

  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (props.jwt === "") {
      props.history.push({
        pathname: "/login",
      });
      return;
    }

    fetch("http://localhost:4000/v1/movies")
    .then((response) => {
      if (response.status !== 200) {
        setError("Invalid response: ", response.status);
      } else {
        setError(null);
      }
      return response.json();
    })
    .then((json) => {
      setMovies(json.movies);
    });
  });

  if (error !== null) {
    return <div>Error: {error.message}</div>
  } else {
    return (
      <Fragment>
          <h2>Manage Catalog</h2>

          <div className='list-group'>
            {movies.map( (m) => (
              <Link 
                key={m.id} 
                to={`/admin/movie/${m.id}`}
                className='list-group-item list-group-item-action'
              >
                {m.title}
              </Link> 
            ))}
          </div>
        </Fragment>
    );
  };
};