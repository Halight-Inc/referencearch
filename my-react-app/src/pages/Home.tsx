import { useState } from "react";
import reactLogo from "../assets/react.svg"; // Adjust path if needed
import viteLogo from "/vite.svg"; // Keep this as is
import "../App.css"; // If you still want the default styling

const Home = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <a href="https://vite.dev" target="_blank">
        <img src={viteLogo} className="logo" alt="Vite logo" />
      </a>
      <a href="https://react.dev" target="_blank">
        <img src={reactLogo} className="logo react" alt="React logo" />
      </a>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <p>
        Edit <code>Home.tsx</code> and save to test HMR.
      </p>
    </div>
  );
};

export default Home;
