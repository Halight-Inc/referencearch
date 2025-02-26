import React, { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './Login';
import ItemList from './ItemList';
import { SplitFactory } from '@splitsoftware/splitio';

const App: React.FC = () => {
    const [count, setCount] = useState(0)
    const [token, setToken] = useState(localStorage.getItem('jwtToken') || '');
    const [showNewFeature, setShowNewFeature] = useState(false);

    useEffect(() => {
        const factory = SplitFactory({
            core: {
                authorizationKey: 'YOUR_SPLIT_CLIENT_SIDE_API_KEY'
            }
        });
        const splitClient = factory.client();

        splitClient.on(splitClient.Event.SDK_READY, () => {
            const showNewFeatureFlag = splitClient.getTreatment('user-key', 'show-new-feature');
            setShowNewFeature(showNewFeatureFlag === 'on');
        });
    }, []);

    const handleLogin = (newToken: string) => {
        setToken(newToken);
    };

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
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
            <div className="App">
                {token ? (
                    <ItemList token={token} showNewFeature={showNewFeature} />
                ) : (
                    <Login onLogin={handleLogin} />
                )}
            </div>
        </>
    );
};

export default App;
