import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import AuthReducer from './slices/AuthSlice';
import AppReducer from './slices/AppSlice';
import { useQuery } from '@apollo/client';
import { GET_ME } from '../graphql/queries/GetMe';
// import { GetCharctersQuery, GetCharctersQueryVariables } from '../gql/graphql';
// import { GET_CHARACTERS } from '../graphql/queries/getCaracters';

interface ReduxProvider {
  children: React.ReactElement<any>;
}
const ReduxProvider = ({ children }: ReduxProvider) => {
  const { data, loading, error } = useQuery(GET_ME);

  const reducer = {
    auth: AuthReducer,
    app: AppReducer,
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
    },
  });
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
