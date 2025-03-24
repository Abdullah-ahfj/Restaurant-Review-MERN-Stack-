import React, { useEffect, useState } from 'react';
import RestaurantDataService from "../services/restaurant";
import {Link} from "react-router-dom";

const RestaurantsList = props => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchZip, setSearchZip] = useState("");
  const [searchCuisine, setSearchCuisine] = useState("");
  const [cuisines, setCuisines] = useState(["All Cuisines"]);

  useEffect(() => {
    retrieveRestaurants();
    retrieveCuisines();
  }, []);

  const onChangeSearchName = e => {
    const searchName = e.target.value;
    setSearchName(searchName);
  }

  const onChangeSearchZip = e => {
    const searchZip = e.target.value;
    setSearchZip(searchZip);
  }

  const onChangeSearchCuisine = e => {
    const searchCuisine = e.target.value;
    setSearchCuisine(searchCuisine);
  }

  const retrieveRestaurants = () => {
    RestaurantDataService.getAll()
      .then(res => {
        console.log(res.data);
        setRestaurants(res.data.restaurants);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const retrieveCuisines = () => {
    RestaurantDataService.getCuisine()
      .then(res => {
        console.log(res.data);
        setCuisines(["All Cuisines"].concat(res.data));

      })
      .catch(e => {
        console.log(e);
      })
  }

  const refreshList = () => {
    retrieveRestaurants();
  };

  const find = (query, by) => {
    RestaurantDataService.find(query, by)
      .then(res => {
        console.log(res.data);
        setRestaurants(res.data.restaurants);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const findByName = () => {
    find(searchName, "name")
  };

  const findByZip = () => {
    find(searchZip, "zipcode")
  };

  const findByCuisine = () => {
    if (searchCuisine == "All Cuisines") {
      refreshList();
    }else{
      find(searchCuisine, "cuisine")
    }
  };

 return (
    <div className="container">
      <div className="row pb-3">
        <div className="col-md-4 mb-2">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name"
              value={searchName}
              onChange={onChangeSearchName}
            />
            <div className="input-group-append">
              <button className="btn btn-outline-secondary" type="button" onClick={findByName}>
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-2">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search by zip"
              value={searchZip}
              onChange={onChangeSearchZip}
            />
            <div className="input-group-append">
              <button className="btn btn-outline-secondary" type="button" onClick={findByZip}>
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-2">
          <div className="input-group">
            <select className="form-control" onChange={onChangeSearchCuisine}>
              {cuisines.map((cuisine, index) => (
                <option key={index} value={cuisine}>
                  {cuisine.substr(0, 20)}
                </option>
              ))}
            </select>
            <div className="input-group-append">
              <button className="btn btn-outline-secondary" type="button" onClick={findByCuisine}>
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {restaurants.map((restaurant) => {
          const address = `${restaurant.address.building} ${restaurant.address.street}, ${restaurant.address.zipcode}`;
          return (
            <div className="col-lg-4 col-md-6 mb-3" key={restaurant._id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{restaurant.name}</h5>
                  <p className="card-text">
                    <strong>Cuisine: </strong> {restaurant.cuisine}
                    <br />
                    <strong>Address: </strong> {address}
                  </p>
                  <div className="d-flex justify-content-between">
                    <Link to={`/restaurants/${restaurant._id}`} className="btn btn-primary">
                      View Reviews
                    </Link>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`http://www.google.com/maps/place/${address}`}
                      className="btn btn-primary"
                    >
                      View Map
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

}

export default RestaurantsList;