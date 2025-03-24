import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import RestaurantDataService from "../services/restaurant";

const Restaurant = (props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const initialRestaurantState = {
    id: null,
    name: "",
    address: {},
    cuisine: "",
    reviews: [],
  };
  const [restaurant, setRestaurant] = useState(initialRestaurantState);

  const getRestaurant = (id) => {
    RestaurantDataService.get(id)
      .then((res) => {
        setRestaurant(res.data);
        console.log(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    if (id) {
      getRestaurant(id);
    }
  }, [id]);

  const deleteReview = (reviewId, index) => {
    RestaurantDataService.deleteReview(reviewId, props.user.id)
      .then(() => {
        setRestaurant((prevState) => {
          const updatedReviews = [...prevState.reviews];
          updatedReviews.splice(index, 1);
          return { ...prevState, reviews: updatedReviews };
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div>
      {restaurant ? (
        <>
          <h5>{restaurant.name}</h5>
          <p>
            <strong>Cuisine: </strong>
            {restaurant.cuisine}
            <br />
            <strong>Address: </strong>
            {restaurant.address.building} {restaurant.address.street},{" "}
            {restaurant.address.zipcode}
          </p>
          <Link to={`/restaurants/${id}/review`} className="btn btn-primary mb-3">
            Add Review
          </Link>

          <h4>Reviews</h4>
          <div className="row">
            {restaurant.reviews && restaurant.reviews.length > 0 ? (
              restaurant.reviews.map((review, index) => (
                <div className="col-lg-4 pb-1" key={index}>
                  <div className="card">
                    <div className="card-body">
                      <p className="card-text">
                        {review.text}
                        <br />
                        <strong>User: </strong>
                        {review.name}
                        <br />
                        <strong>Date: </strong>
                        {review.date}
                      </p>
                      {props.user && props.user.id === review.user_id && (
                        <div className="row">
                          <button
                            onClick={() => deleteReview(review._id, index)}
                            className="btn btn-danger ml-1 mr-2"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => navigate(`/restaurants/${id}/review`, { state: { currentReview: review } })}
                            className="btn btn-primary ml-1 mt-2 mr-2"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-sm-12">
                <p>No reviews yet.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div>
          <br />
          <p>No restaurant selected.</p>
        </div>
      )}
    </div>
  );
};

export default Restaurant;
