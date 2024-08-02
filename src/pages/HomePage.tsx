import React, { useEffect } from 'react';
import { GET_PRODUCTS } from '../graphql/queries/GetProducts';
import { useQuery, useSubscription } from '@apollo/client';
import { CREATED_PRODUCT_SUBSCRIPTION } from '../graphql/subcriptions/CreateProduct';

const HomePage = () => {
  // const {
  //   loading: subLoading,
  //   error: subError,
  //   data: subData,
  // } = useSubscription(CREATED_PRODUCT_SUBSCRIPTION);
  const { data, loading, error, subscribeToMore } = useQuery(GET_PRODUCTS, {
    variables: {
      input: {
        take: 0,
        skip: 0,
        keyword: '',
      },
    },
  });
  useEffect(() => {
    // Yeni ürünler eklendiğinde listeyi güncellemek için subscribeToMore'u kullanın
    const unsubscribe = subscribeToMore({
      document: CREATED_PRODUCT_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newProduct = subscriptionData.data.productCreated;

        return {
          ...prev,
          getProducts: {
            ...prev.getProducts,
            products: [newProduct, ...prev.getProducts.products],
            total: prev.getProducts.total + 1,
          },
        };
      },
    });

    // Aboneliği bileşen temizlenirken iptal edin
    return () => unsubscribe();
  }, [subscribeToMore]);
  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error...</p>;
  }

  return (
    <div>
      <div>
        {/* <h1>{subData && <div>{subData.productCreated.id}</div>}</h1> */}
        {data &&
          data.getProducts.products.map((product) => (
            <div key={product.id}>
              <h2>{product.name}</h2>
            </div>
          ))}
      </div>
    </div>
  );
};

export default HomePage;
