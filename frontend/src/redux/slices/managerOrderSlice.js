import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const fetchManagerOrders = createAsyncThunk(
  'managerOrders/fetchManagerOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/manager/orders`, {
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

export const approveOrder = createAsyncThunk(
  'managerOrders/approveOrder',
  async (orderId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/manager/orders/${orderId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to approve order');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'managerOrders/cancelOrder',
  async (orderId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/manager/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const managerOrderSlice = createSlice({
  name: 'managerOrders',
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch orders
      .addCase(fetchManagerOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchManagerOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchManagerOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Approve order
      .addCase(approveOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(approveOrder.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(approveOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cancel order
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default managerOrderSlice.reducer; 