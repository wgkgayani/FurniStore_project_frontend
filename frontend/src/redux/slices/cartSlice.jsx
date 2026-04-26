import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000";

// Get token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return [];
      }
      const response = await axios.get(`${API_URL}/users/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.cart || [];
    } catch (error) {
      return [];
    }
  },
);

export const saveCartToAPI = createAsyncThunk(
  "cart/saveCartToAPI",
  async (cart, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return cart;
      }
      const response = await axios.put(
        `${API_URL}/users/cart`,
        { cart },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data.cart || cart;
    } catch (error) {
      return cart;
    }
  },
);

export const clearCartAPI = createAsyncThunk(
  "cart/clearCartAPI",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return [];
      }
      await axios.delete(`${API_URL}/users/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return [];
    } catch (error) {
      return [];
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.productId === action.payload.productId,
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity || 1;
      } else {
        state.items.push({
          ...action.payload,
          quantity: action.payload.quantity || 1,
        });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload,
      );
    },
    updateQuantity: (state, action) => {
      const item = state.items.find(
        (item) => item.productId === action.payload.productId,
      );
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state) => {
        state.loading = false;
        state.items = [];
      })
      .addCase(saveCartToAPI.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(clearCartAPI.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;

