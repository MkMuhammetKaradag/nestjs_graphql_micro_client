import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import AuthReducer from './slices/AuthSlice';
import AppReducer from './slices/AppSlice';
import ShoppingCartReducer from './slices/ShoppingCartSlice';
import { useQuery } from '@apollo/client';
import { GET_ME } from '../graphql/queries/GetMe';
import { GET_MY_SHOPPING_CART } from '../graphql/queries/GetMyShoppingCart';
import { Product } from '../utils/productTypes';
// import { GetCharctersQuery, GetCharctersQueryVariables } from '../gql/graphql';
// import { GET_CHARACTERS } from '../graphql/queries/getCaracters';

interface ReduxProvider {
  children: React.ReactElement<any>;
}
const ReduxProvider = ({ children }: ReduxProvider) => {
  const { data, loading, error } = useQuery(GET_ME);
  const {
    data: dataBasket,
    loading: loadingBasket,
    error: errorBasket,
    // subscribeToMore,
  } = useQuery(GET_MY_SHOPPING_CART);
  const reducer = {
    auth: AuthReducer,
    app: AppReducer,
    shoppingCart: ShoppingCartReducer,
  };

  const store = configureStore({
    reducer: reducer,
    preloadedState: {
      auth: {
        user: data?.getMe,
        isAuth: !data && !!error,
      },
      app: {
        searchText: '',
      },
      shoppingCart: {
        items: dataBasket?.getMyShoppingCart?.shoppingCart?.items || [],
      },
    },
  });
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
