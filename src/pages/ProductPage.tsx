import { useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { GET_PRODUCT } from '../graphql/queries/GetProduct';
interface Vendor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface Product {
  id: number;
  description: string;
  price: number;
  quantity: number;
  images: string[] | null;
  name: string;
  vendor: Vendor;
}
const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  // const [isLoaded, setIsLoaded] = useState(false);

  const {
    data: dataProduct,
    loading: loadingProduct,
    error,
  } = useQuery(GET_PRODUCT, {
    variables: {
      input: {
        id: Number(id),
      },
    },
    // onCompleted: () => {
    //   setIsLoaded(true);
    // },
  });

  if (loadingProduct) {
    return <div>Yükleniyor...</div>;
  }

  if (error) {
    return <div>Bir hata oluştu: {error.message}</div>;
  }

  if (!dataProduct || !dataProduct.getProduct.product) {
    return <div>Ürün bulunamadı</div>;
  }
  const product: Product = dataProduct.getProduct.product;
  const { name, description, price, quantity, images, vendor } = product;
  const handleImageClick = (img: string) => {
    setSelectedImage(img);
  };
  const imageArray = images || [];
  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-4">{name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Resim Galerisi */}
          <div>
            {imageArray.length > 0 ? (
              <div className="flex flex-col items-center">
                <img
                  src={selectedImage || imageArray[0]}
                  alt={product.name}
                  className="w-full h-64 object-cover mb-4"
                />
                <div className="flex space-x-2">
                  {imageArray.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`${product.name} - ${index + 1}`}
                      className={`w-16 h-16 object-cover border-2 rounded cursor-pointer ${
                        selectedImage === img
                          ? 'border-blue-500'
                          : 'border-gray-300'
                      }`}
                      onClick={() => handleImageClick(img)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Resim Yok</span>
              </div>
            )}
          </div>

          {/* Ürün Bilgileri */}
          <div>
            <p className="text-gray-700 mb-4">{description}</p>
            <p className="text-2xl font-semibold text-blue-600 mb-4">
              ${price}
            </p>
            <p className="text-lg text-gray-500 mb-4">Stok: {quantity}</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
              Sepete Ekle
            </button>

            {/* Satıcı Bilgileri */}
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-2">Satıcı Bilgileri</h2>
              <p className="text-gray-700">{`${vendor.firstName} ${vendor.lastName}`}</p>
              <p className="text-gray-500">{vendor.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
