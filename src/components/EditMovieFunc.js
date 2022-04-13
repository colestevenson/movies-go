import React, { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import './EditMovie.css';
import Input from './form-components/Input';
import TextArea from './form-components/TextArea';
import Select from './form-components/Select';
import Alert from './ui-components/Alert';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default function EditMovieFunc(props) {

  const [movie, setMovie] = useState({});
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState([]);
  const [alert, setAlert] = useState({type: "d-none", message: ""});
  const mpaaOptions = [
    {id: "G", value: "G"},
    {id: "PG", value: "PG"},
    {id: "PG-13", value: "PG-13"},
    {id: "R", value: "R"},
    {id: "NC-17", value: "NC-17"},
  ];

  useEffect(() => {
    if (props.jwt === "") {
      props.history.push({
        pathname: "/login",
      });
      return;
    };

    const id = props.match.params.id;
    if (id > 0) {
      fetch("http://localhost:4000/v1/movie/" + id)
      .then((response) => {
        if (response.status !== 200) {
          setError("Invalid response: ", response.status);
        } else {
          setError(null);
        };
        return response.json();
      })
      .then((json) => {
        const releaseDate = new Date(json.movie.release_date);
        json.movie.release_date = releaseDate.toISOString().split("T")[0];
        setMovie(json.movie)
      });
    };
  }, [props.history, props.jwt, props.match.params.id]);

  const handleChange = () => (evt) => {
    let value = evt.target.value;
    let name = evt.target.name;

    setMovie({
      ...movie,
      [name]: value,
    });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();

    // client side validation happens NOW
    let errors = [];
    if (movie.title === "") {
      errors.push("title");
    };

    setErrors(errors);

    if (errors.length > 0) {
      return false;
    };

    const data = new FormData(evt.target);
    const payload = Object.fromEntries(data.entries());
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + props.jwt);

    const requestOptions = {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: myHeaders,
    };

    fetch('http://localhost:4000/v1/admin/editmovie', requestOptions)
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        setAlert({
          alert: { type: "alert-danger", message: data.error.message },
        });
      } else {
        props.history.push({
          pathname:"/admin"
        });
      };
    });
  };

  const confirmDelete = (e) => {
    confirmAlert({
      title: 'Delete Movie?',
      message: 'Are you sure?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            // delete the movie
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer " + props.jwt);
            
            fetch("http://localhost:4000/v1/admin/deletemovie/" + movie.id, {method: "GET"})
            .then(response => response.json())
            .then(data => {
              if (data.error) {
                setAlert({
                  alert: {type: "alert-danger", message: data.error.message}
                })
              } else {
                setAlert({
                  alert: {type: "alert-success", message: "Movie deleted!"}
                });
                props.history.push({
                  pathname: "/admin"
                });
              };
            });
          }
        },
        {
          label: 'No',
          onClick: () => {}
        },
      ]
    });
  };

  const hasError = (key) => {
    return errors.indexOf(key) !== -1;
  }

  if (error !== null) {
    return <div>Error: {error.message}</div>
  } else {
    return (
      <Fragment>
        <h2>Add/Edit Movie</h2>

        <Alert
          alertType={alert.type}
          alertMessage={alert.message}
        />

        <hr />
        <form onSubmit={handleSubmit}>
          <input 
            type='hidden' 
            name='id' 
            id='id' 
            value={movie.id}
            onChange={handleChange("id")}
          />     

          <Input 
            title={"Title"}
            className={hasError("title") ? "is-invalid" : ""}
            type={'text'}
            name={'title'}
            value={movie.title}
            handleChange={handleChange("title")}
            errorDiv={hasError("title") ? "text-danger" : "d-none"}
            errorMsg={"Please Enter a Title"}
          />

          <Input 
            title={"Release Date"}
            type={'date'}
            name={'release_date'}
            value={movie.release_date}
            handleChange={handleChange("release_date")}
          />

          <Input 
            title={"Runtime"}
            type={'text'}
            name={'runtime'}
            value={movie.runtime}
            handleChange={handleChange("runtime")}
          />

          <Select 
            title={"MPAA Rating"}
            name={'mpaa_rating'}
            options={mpaaOptions}
            value={movie.mpaa_rating}
            handleChange={handleChange("mpaa_rating")}
            placeholder={"Choose"}
          />

          <Input 
            title={"Rating"}
            type={'text'}
            name={'rating'}
            value={movie.rating}
            handleChange={handleChange("rating")}
          />

          <TextArea
            title={"Description"}
            name={'description'}
            rows={'3'}
            value={movie.description}
            handleChange={handleChange("description")}
          />

          <hr />
          <button className='btn btn-primary'>Save</button>

          <Link to="/admin" className="btn btn-warning ms-1">Cancel</Link>

          {movie.id > 0 && (
            <a 
              href="#!" 
              onClick={() => confirmDelete()} 
              className="btn btn-danger ms-1"
            >
              Delete
            </a>
          )}
        </form>
      </Fragment>
    );
  }

}