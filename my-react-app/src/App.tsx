import React, { useState } from "react";
import {Link} from "react-router-dom"
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Login from "./Login";
import ItemList from "./ItemList";
import Payment from "./Payment";
import { useSplitTreatments } from "@splitsoftware/splitio-react";

const App: React.FC = () => {
    const featureName = "hello-world";

    const [count, setCount] = useState(0);
    const [token, setToken] = useState(localStorage.getItem("jwtToken") || "");
    const { treatments, isReady } = useSplitTreatments({
        names: [featureName],
    });
    const { treatment, config } = treatments[featureName] || {};

    const handleLogin = (newToken: string) => {
        setToken(newToken);
    };

    return (
        <>    
            {/* ✅ Navigation Added */}
            <nav>
                <Link to="/">🏠 Home</Link> |{" "}
                <Link to="/hello">🌎 Hello World</Link>
                <a href="https://energizelms.com">Marketing Site</a>
            </nav>
            <div hidden={isReady && treatment === "off"}>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img
                        src={reactLogo}
                        className="logo react"
                        alt="React logo"
                    />
                </a>
                <h1>Hello World</h1>
                <div className="card">
                    <button onClick={() => setCount((count) => count + 1)}>
                        count is {count}
                    </button>
                </div>
                {config}
            </div>
            <div className="App">
                {token ? (
                    <>
                        <ItemList
                            token={token}
                            showNewFeature={isReady && treatment === "on"}
                        />
                        Credit Card Processing:
                        <Payment />
                    </>
                ) : (
                    <Login onLogin={handleLogin} />
                )}
            </div>
        </>
    );
};

export default App;
