import React, { useState, useCallback } from "react";
import {Link} from "react-router-dom"
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Login from "./Login";
import ItemList from "./ItemList";
import Payment from "./Payment";
import { useSplitTreatments } from "@splitsoftware/splitio-react";
import { motion } from "framer-motion";
import ReactConfetti from "react-confetti";

const App: React.FC = () => {
    const featureName = "hello-world";

    const [count, setCount] = useState(0);
    const [token, setToken] = useState(localStorage.getItem("jwtToken") || "");
    const [showConfetti, setShowConfetti] = useState(false);
    const { treatments, isReady } = useSplitTreatments({
        names: [featureName],
    });
    const { treatment, config } = treatments[featureName] || {};

    const handleLogin = (newToken: string) => {
        setToken(newToken);
    };

    const handleButtonClick = useCallback(() => {
        setCount((count) => count + 1);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000); // Stop confetti after 3 seconds
    }, []);

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
                    {showConfetti && (
                        <ReactConfetti
                            width={window.innerWidth}
                            height={window.innerHeight}
                            numberOfPieces={200}
                            recycle={false}
                            gravity={0.2}
                            initialVelocityX={5}
                            initialVelocityY={15}
                            confettiSource={{
                                x: window.innerWidth / 2,
                                y: window.innerHeight / 2,
                                w: 0,
                                h: 0,
                            }}
                        />
                    )}
                    <motion.button
                        onClick={handleButtonClick}
                        whileHover={{ 
                            scale: 1.1,
                            boxShadow: "0px 0px 8px rgb(var(--primary-rgb))",
                            backgroundColor: "rgba(var(--primary-rgb), 0.7)"
                        }}
                        transition={{ 
                            type: "spring", 
                            stiffness: 400, 
                            damping: 10 
                        }}
                    >
                        count is {count}
                    </motion.button>
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
