import "./App.css";
import axios from "axios";
import React, { useState, useEffect } from "react";
import Card from "./Card";

function App() {
  let api_data = [];
  let trending = [];

  const api_key = process.env.REACT_APP_API_KEY;

  const [found, setFound] = useState(false);
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState([]);
  const [search, setSearch] = useState('Try "dogs"');
  const [display, setDisplay] = useState(true);

  useEffect(() => {
    axios
      .get(`https://api.giphy.com/v1/gifs/trending?api_key=${api_key}`)
      .then((response) => {
        response.data.data.map((i) => trending.push(i));
        setLoaded(trending);
      })
      .catch((error) => {
        console.log("The error is " + error);
      });
  });

  const fetchApi = () => {
    let input = document.getElementById("search").value;

    axios
      .get(`http://api.giphy.com/v1/gifs/search?q=${input}&api_key=${api_key}`)
      .then((response) => {
        response.data.data.map((i) => api_data.push(i));
        setFound(true);
        setItems(api_data);
        setDisplay(false);

        if (items.length == 0) {
          setSearch("No results");
        }
      })
      .catch((error) => {
        console.log("The error is " + error);
        setFound(false);
        setSearch("No results");
      });
  };

  const trendingImages =
    !found && loaded.length !== 0
      ? loaded.map((i) => <Card img={i.images.fixed_height.url} />)
      : null;

  const images =
    found && items.length !== 0 ? (
      items.map((i) => <Card img={i.images.fixed_height.url} />)
    ) : (
      <h2 className="no-results">{search}</h2>
    );

  return (
    <div className="App">
      <h2>GIF Search</h2>
      <input type="text" id="search" placeholder="Search GIFS" />
      <button id="search-btn" onClick={fetchApi}>
        Search
      </button>
      <div className="container"> {display ? trendingImages : images}</div>
    </div>
  );
}

export default App;
