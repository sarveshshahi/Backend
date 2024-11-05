import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";

function App() {
  const [jokes, setjokes] = useState([]);
  useEffect(() => {
    axios
      .get("/api/jokes")
      .then((response) => {
        setjokes(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  return (
    <>
      <h1>We learn how to connent Backend to Frontend</h1>
      <p>jokes:{jokes.length}</p>
      {jokes.map((joke, index) => (
        <div key={joke.id}>
          <h4>{joke.title}</h4>
          <p>{joke.content}</p>
        </div>)
      )}
    </>
  );
}

export default App;
