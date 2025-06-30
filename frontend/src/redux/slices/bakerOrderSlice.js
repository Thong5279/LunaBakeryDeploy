import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const fetchBakerOrders = createAsyncThunk(
  'bakerOrders/fetchBakerOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/baker/orders`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const startBaking = createAsyncThunk(
  'bakerOrders/startBaking',
  async (orderId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/baker/orders/${orderId}/start-baking`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to start baking');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const completeBaking = createAsyncThunk(
  'bakerOrders/completeBaking',
  async (orderId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/baker/orders/${orderId}/complete`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to complete baking');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const bakerOrderSlice = createSlice({
  name: 'bakerOrders',
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch orders
      .addCase(fetchBakerOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBakerOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchBakerOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Start baking
      .addCase(startBaking.pending, (state) => {
        state.loading = true;
      })
      .addCase(startBaking.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(startBaking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Complete baking
      .addCase(completeBaking.pending, (state) => {
        state.loading = true;
      })
      .addCase(completeBaking.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(completeBaking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default bakerOrderSlice.reducer; 