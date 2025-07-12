import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';

const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);

  let curr_url = window.location.href;
  let root_url = curr_url.substring(0, curr_url.indexOf("postreview"));
  let params = useParams();
  let id = params.id;
  let dealer_url = root_url + `djangoapp/dealer/${id}`;
  let review_url = root_url + `djangoapp/add_review`;
  let carmodels_url = root_url + `djangoapp/get_cars`;

  const postreview = async () => {
    let name = sessionStorage.getItem("firstname") + " " + sessionStorage.getItem("lastname");
    if (name.includes("null")) {
      name = sessionStorage.getItem("username");
    }
    if (!model || review.trim() === "" || date === "" || year === "") {
      alert("Please fill out all fields before submitting.");
      return;
    }

    let [make_chosen, ...model_parts] = model.split(" ");
    let model_chosen = model_parts.join(" ");

    let jsoninput = JSON.stringify({
      "name": name,
      "dealership": id,
      "review": review,
      "purchase": true,
      "purchase_date": date,
      "car_make": make_chosen,
      "car_model": model_chosen,
      "car_year": year,
    });

    try {
      const res = await fetch(review_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: jsoninput,
      });
      const json = await res.json();
      if (json.status === 200) {
        window.location.href = window.location.origin + "/dealer/" + id;
      } else {
        alert("Failed to post review. Please try again.");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error. Please check your connection.");
    }
  };

  const get_dealer = async () => {
    const res = await fetch(dealer_url);
    const data = await res.json();
    if (data.status === 200 && data.dealer.length > 0) {
      setDealer(data.dealer[0]);
    }
  };

  const get_cars = async () => {
    const res = await fetch(carmodels_url);
    const data = await res.json();
    setCarmodels(data.CarModels || []);
  };

  useEffect(() => {
    get_dealer();
    get_cars();
  }, []);

  return (
    <div>
      <Header />
      <div className="review-card">
        <h2 className="dealer-title">Post a Review for {dealer.full_name}</h2>
        
        <textarea
          className="input-textarea"
          placeholder="Write your review here..."
          rows="5"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        ></textarea>
        
        <div className="input-group">
          <label>Purchase Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className="input-group">
          <label>Car Make & Model:</label>
          <select value={model} onChange={(e) => setModel(e.target.value)}>
            <option value="" disabled hidden>Select car make & model</option>
            {carmodels.map((carmodel, idx) => (
              <option key={idx} value={carmodel.CarMake + " " + carmodel.CarModel}>
                {carmodel.CarMake} {carmodel.CarModel}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>Car Year (2015–2023):</label>
          <input type="number" value={year} onChange={(e) => setYear(e.target.value)} max="2023" min="2015" />
        </div>

        <button className="postreview-btn" onClick={postreview}>Submit Review</button>
      </div>
    </div>
  );
}

export default PostReview;
