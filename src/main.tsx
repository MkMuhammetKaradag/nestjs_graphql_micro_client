import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ApolloProvider } from '@apollo/client';
import client from './graphql/apolloClient.ts';
import { BrowserRouter } from 'react-router-dom';
import Router from './Router/Router.tsx';
import ReduxProvider from './context/ReduxProvider.tsx';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ReduxProvider>
        <BrowserRouter>
          <Toaster position="top-center" reverseOrder={false} />
          <Router></Router>
          <App />
        </BrowserRouter>
      </ReduxProvider>
    </ApolloProvider>
  </React.StrictMode>
);
