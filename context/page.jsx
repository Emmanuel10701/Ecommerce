"use client"; // Ensure this file is treated as client-side

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

// Define types
interface CartItem {
  id: string; // Ensure id is a string
  name: string;
  price: number;
  quantity: number;
  imageUrl: string; // Use imageUrl, not image
}

interface CartState {
  items: CartItem[];
}

interface AddToCartAction {
  type: 'ADD_TO_CART';
  payload: CartItem;
}

interface RemoveFromCartAction {
  type: 'REMOVE_FROM_CART';
  payload: { id: string }; // Ensure id is a string
}

interface UpdateQuantityAction {
  type: 'UPDATE_QUANTITY';
  payload: { id: string; quantity: number }; // Ensure id is a string
}

type CartAction = AddToCartAction | RemoveFromCartAction | UpdateQuantityAction;

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
        return { items: updatedItems };
      }
      return { items: [...state.items, action.payload] };
    }
    case 'REMOVE_FROM_CART': {
      const updatedItems = state.items.filter(item => item.id !== action.payload.id);
      return { items: updatedItems };
    }
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
      );
      return { items: updatedItems };
    }
    default:
      return state;
  }
};

// Function to load cart from localStorage, wrapped in a check
const loadCartFromLocalStorage = (): CartState => {
  if (typeof window !== 'undefined') {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const items: CartItem[] = JSON.parse(savedCart);
        if (Array.isArray(items)) {
          return { items };
        }
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
      }
    }
  }
  return { items: [] };
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, loadCartFromLocalStorage());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(state.items));
    }
  }, [state.items]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
