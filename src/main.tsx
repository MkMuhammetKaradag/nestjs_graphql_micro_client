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
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
const stripePromise = loadStripe(
  'pk_test_51Jw1X5Cc0LH5D4U4SrGyfGXitlzE3JGETRK3okWx0mqmqosgmSIuUoHNGzESY5nEZ5bGJRS9WG1fst0S2783EyBe00HKMVgJsF'
);
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ReduxProvider>
        <Elements stripe={stripePromise}>
          <BrowserRouter>
            <Toaster position="top-center" reverseOrder={false} />
            <Router></Router>
            <App />
          </BrowserRouter>
        </Elements>
      </ReduxProvider>
    </ApolloProvider>
  </React.StrictMode>
);
