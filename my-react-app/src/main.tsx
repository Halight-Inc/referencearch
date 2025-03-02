import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SplitFactoryProvider } from '@splitsoftware/splitio-react';

const SPLIT_CLIENT_API_KEY = import.meta.env.VITE_SPLIT_API_KEY;

// Create the config for the SDK factory.
const sdkConfig: SplitIO.IBrowserSettings = {
  core: {
    authorizationKey: SPLIT_CLIENT_API_KEY,
    // key represents your internal user id, or the account id that 
    // the user belongs to. 
    // This could also be a cookie you generate for anonymous users.
    key: 'key'
  }
};

createRoot(document.getElementById('root')!).render(
  <SplitFactoryProvider config={sdkConfig} >
    <App />
  </SplitFactoryProvider>,
)
