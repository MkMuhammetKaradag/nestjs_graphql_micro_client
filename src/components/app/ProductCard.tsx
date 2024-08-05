import React, { useState } from 'react';
import { Product } from '../../utils/productTypes';
import { string } from 'zod';
import { Link } from 'react-router-dom';
interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { name, description, images, price, id: productId } = product;

  // Images'in türünü kontrol et ve uygun bir dizi oluştur
  let imageArray: string[] = [];
  if (Array.isArray(images)) {
    imageArray = images.filter((img) => img); // null veya undefined olanları filtrele
  }

  const [currentImage, setCurrentImage] = useState(0);

  const handleDotClick = (index: number) => {
    setCurrentImage(index);
  };

  return (
    <div className="min-w-sm  max-w-sm rounded overflow-hidden shadow-lg p-3 relative   bg-white">
      <div className="relative">
        {imageArray.length > 0 ? (
          <img
            className="w-72 h-48 object-cover"
            src={imageArray[currentImage]}
            alt={name}
          />
        ) : (
          <div className=" w-72 h-48 flex items-center justify-center bg-gray-200">
            <span className="text-gray-500">Resim Yok</span>
          </div>
        )}
        <div className="flex justify-center absolute w-full">
          {imageArray.map((_, index) => (
            <span
              key={index}
              onClick={() => handleDotClick(index)}
              className={`mx-1 h-2 w-2 rounded-full cursor-pointer    ${
                currentImage === index ? 'bg-gray-700' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="px-6 py-4">
        <Link to={`/product/${productId}`}>
          <div className="font-bold text-xl mb-2">{name}</div>
        </Link>

        <p className="text-gray-700 text-base">
         
          {description.length > 30
            ? `${description.substring(0, 30)}...`
            : description}
        </p>
      </div>
      <div className="px-6 py-4">
        <span className="text-gray-700 text-xl font-semibold">${price}</span>
      </div>
    </div>
  );
};

export default ProductCard;
