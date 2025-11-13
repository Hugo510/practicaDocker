import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  // Variables de entorno
  const apiUrl = window.RUNTIME_ENV?.API_URL || "No configurada";
  const viteApiUrl = import.meta.env.VITE_API_URL || "No configurada";

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>React + Docker Lab</h1>

      <div className="card">
        <h2>Variables de Entorno</h2>
        <div
          style={{ textAlign: "left", margin: "20px auto", maxWidth: "500px" }}
        >
          <p>
            <strong>Runtime API URL:</strong> {apiUrl}
          </p>
          <p>
            <strong>Build-time VITE_API_URL:</strong> {viteApiUrl}
          </p>
        </div>
      </div>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
