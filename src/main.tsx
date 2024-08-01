import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ApolloProvider } from '@apollo/client';
import client from './graphql/apolloClient.ts';
import { BrowserRouter } from 'react-router-dom';
import Router from './Router/Router.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Router></Router>
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);
