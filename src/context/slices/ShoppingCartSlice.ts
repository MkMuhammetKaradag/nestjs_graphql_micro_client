// store/shoppingCartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../utils/productTypes';
// import { Product } from '../types/Product';

type ShoppingCartItem = {
  product: Product;
  quantity: number;
};

type ShoppingCartState = {
  id: number;
  items: ShoppingCartItem[];
};

const initialState: ShoppingCartState = {
  id: 0,
  items: [],
};

const shoppingCartSlice = createSlice({
  name: 'shoppingCart',
  initialState,
  reducers: {
    setId: (state, action: PayloadAction<number>) => {
      state.id = action.payload;
    },
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(
        (item) => item.product.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ product: action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(
        (item) => item.product.id !== action.payload
      );
    },
    removeFromCartItem: (state, action: PayloadAction<number>) => {
      const existingItem = state.items.find(
        (item) => item.product.id === action.payload
      );
      if (existingItem && existingItem.quantity > 1) {
        existingItem.quantity -= 1;
      } else {
        state.items = state.items.filter(
          (item) => item.product.id !== action.payload
        );
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    setCartItems: (state, action: PayloadAction<ShoppingCartItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  setCartItems,
  removeFromCartItem,
  setId,
} = shoppingCartSlice.actions;

export default shoppingCartSlice.reducer;
