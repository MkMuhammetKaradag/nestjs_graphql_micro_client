import React, { useEffect, useState } from 'react';
import { GET_PRODUCTS } from '../graphql/queries/GetProducts';
import { useQuery, useSubscription } from '@apollo/client';
import { CREATED_PRODUCT_SUBSCRIPTION } from '../graphql/subcriptions/CreateProduct';
import ProductCard from '../components/app/ProductCard';
import { Product } from '../utils/productTypes';
import Pagination from '../components/app/Pagination';
import { useAppSelector } from '../context/hooks';
const HomePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log(page);
  };
  const searchText = useAppSelector((s) => s.app.searchText);
  const { data, loading, error, subscribeToMore } = useQuery(GET_PRODUCTS, {
    variables: {
      input: {
        take: itemsPerPage,
        skip: itemsPerPage * (currentPage - 1),
        keyword: searchText,
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
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4  justify-center">
        {data &&
          data.getProducts.products.map((product: Product) => (
            <div key={product.id}>
              <ProductCard product={product}></ProductCard>
            </div>
          ))}
      </div>

      <Pagination
        totalItems={data.getProducts.total}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default HomePage;
