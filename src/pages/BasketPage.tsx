import { useMutation, useQuery } from '@apollo/client';
import React from 'react';
import { GET_MY_SHOPPING_CART } from '../graphql/queries/GetMyShoppingCart';
import { Product } from '../utils/productTypes';
import { ADD_SHOPPING_CART_PRODUCT } from '../graphql/mutations/AddShoppingCardProduct';
import { REMOVE_SHOPPING_CART_PRODUCT } from '../graphql/mutations/RemoveShoppinCartProduct';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../context/store';
import {
  addToCart,
  clearCart,
  removeFromCart,
  removeFromCartItem,
} from '../context/slices/ShoppingCartSlice';
import toast from 'react-hot-toast';
import { REMOVE_SHOPPING_CART_ITEM } from '../graphql/mutations/RemoveShoppingCartItem';

const BasketPage = () => {
  const items = useSelector((state: RootState) => state.shoppingCart.items);
  const dispatch = useDispatch();

  const [updateCartItem] = useMutation(ADD_SHOPPING_CART_PRODUCT);
  const [removeCartItemProduct] = useMutation(REMOVE_SHOPPING_CART_PRODUCT);
  const [removeCartItem] = useMutation(REMOVE_SHOPPING_CART_ITEM);

  const totalAmount = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const handleIncreaseQuantity = async (product: Product) => {
    try {
      await updateCartItem({
        variables: { input: { productId: product.id } },
      });

      dispatch(addToCart(product));
      toast.success(`product added basket `);
    } catch (error: any) {
      toast.error(`hata  ${error.graphQLErrors[0].message}`);
    }
  };

  const handleDecreaseQuantity = async (productId: number) => {
    const item = items.find((item) => item.product.id === productId);
    if (item && item.quantity > 1) {
      try {
        await removeCartItemProduct({
          variables: { input: { productId: productId } },
        });
        dispatch(removeFromCartItem(productId));
      } catch (error: any) {
        console.log(error.graphQLErrors[0].message);
      }
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleRemoveItem = async (productId: number) => {
    try {
      await removeCartItem({ variables: { input: { productId: productId } } });

      dispatch(removeFromCart(productId));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="container mx-auto py-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Alışveriş Sepeti</h1>
      {items.length === 0 ? (
        <div>Sepetinizde ürün bulunmamaktadır.</div>
      ) : (
        <div className="w-3/4 flex flex-col ">
          <div className="grid grid-cols-1 gap-6">
            {items.map((item, index) => (
              <div key={index}>
                <div className="flex flex-col sm:flex-row items-center justify-between p-4 border rounded-lg shadow-md space-y-4 sm:space-y-0">
                  <div className="flex items-center space-x-4 flex-1">
                    <img
                      src={item.product.images?.[0] || '/placeholder.jpg'}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h2 className="text-lg font-medium">
                        {item.product.name}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {item.product.description.substring(0, 40)}...
                      </p>
                      <p className="text-sm font-semibold">
                        Adet: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-4 mr-10">
                    <button
                      disabled={item.quantity < 2}
                      onClick={() => handleDecreaseQuantity(item.product.id)}
                      className={`px-3 py-1 rounded-sm ${
                        item.quantity < 2
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-red-500 text-white hover:bg-red-600'
                      }`}
                    >
                      -
                    </button>
                    <button
                      disabled={item.quantity >= item.product.quantity}
                      onClick={() => handleIncreaseQuantity(item.product)}
                      className={`px-3 py-1 rounded-sm ${
                        item.quantity >= item.product.quantity
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-gray-500 text-white hover:bg-gray-600'
                      }`}
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item.product.id)}
                      className="bg-red-500 text-white py-1 px-3 rounded-sm hover:bg-red-600"
                    >
                      Sil
                    </button>
                  </div>
                  <div className="text-right sm:text-left sm:ml-auto ">
                    <p className="text-lg font-semibold">
                      {item.product.price} TL
                    </p>
                    <p className="text-sm text-gray-500">
                      Toplam: {item.product.price * item.quantity} TL
                    </p>
                  </div>
                </div>
                <div>
                  {item.quantity > item.product.quantity && (
                    <span className="text-red-600">
                      sepetinizde stoktan fazla ürün bulunmakta
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-right">
            <h2 className="text-xl font-bold">
              Toplam Tutar: {totalAmount} TL
            </h2>
            <button className="mt-4 bg-red-500 text-white py-2 px-4 rounded-sm hover:bg-red-600">
              Satın Al
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasketPage;
