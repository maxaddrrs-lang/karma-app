import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { GoogleOAuthProvider } from '@react-oauth/google'; 

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="1033644323684-lnm4mhelhh5j7cm094756m93tq3bbqtn.apps.googleusercontent.com"> 
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
