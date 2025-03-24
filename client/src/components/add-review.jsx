import React, { useState } from 'react';
import RestaurantDataService from "../services/restaurant";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"; 

const AddReview = props => {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  let initialReviewState = "";
  let editing = false;

  if (location.state && location.state.currentReview) {
    editing = true;
    initialReviewState = location.state.currentReview.text;
  }

  const [review, setReview] = useState(initialReviewState); 
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = event => {
    setReview(event.target.value);
  };

  const saveReview = () => { 
    
    var data = {
      text: review,
      name: props.user.name,
      user_id: props.user.id,
      restaurant_Id: id
    }

    if (editing) {
      data.review_id = location.state.currentReview._id
      RestaurantDataService.updateReview(data)
        .then(response => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }else{
      RestaurantDataService.createReview(data)
        .then(response => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }
  }


  return(
    <div>
      {props.user ? (
        <div className="submit-form">
          {submitted ? (
            <div>
              <h4>You submitted successfully!</h4>
              <Link to={"/restaurants/" + id} className='btn btn-success'>
                Back to Restaurants
              </Link>
            </div>
          ) : (
            <div>
              <div className="form-group">
                <label htmlFor="descripton">{ editing ? "Edit" : "Create" } Review</label>
                <input 
                  type="text" 
                  className="form-control"
                  id='text'
                  required
                  value={review}
                  onChange={handleInputChange}
                  name='text' 
                />
              </div>
              <button onClick={saveReview} className="btn btn-success">
                Submit
              </button>
            </div>
          )}
        </div>
          
        ) : (

          <div>
           please log in
          </div>

        )}
      
       </div>
  );

};


export default AddReview