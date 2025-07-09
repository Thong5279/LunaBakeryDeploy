import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const fetchDeliveryOrders = createAsyncThunk(
  'deliveryOrders/fetchDeliveryOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/delivery/orders`, {
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

export const startShipping = createAsyncThunk(
  'deliveryOrders/startShipping',
  async (orderId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/delivery/orders/${orderId}/start-shipping`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to start shipping');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const markCannotDeliver = createAsyncThunk(
  'deliveryOrders/markCannotDeliver',
  async ({ id, reason }, { getState, rejectWithValue }) => {
    try {
      console.log('Marking order as cannot deliver:', { id, reason }); // Debug log
      const { auth } = getState();
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/delivery/orders/${id}/cannot-deliver`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Không thể cập nhật trạng thái');
      }

      const data = await response.json();
      console.log('Order marked as cannot deliver:', data); // Debug log
      return data;
    } catch (error) {
      console.error('Error marking order as cannot deliver:', error);
      return rejectWithValue(error.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
    }
  }
);

export const markDelivered = createAsyncThunk(
  'deliveryOrders/markDelivered',
  async (orderId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/delivery/orders/${orderId}/delivered`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to mark as delivered');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const deliveryOrderSlice = createSlice({
  name: 'deliveryOrders',
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch orders
      .addCase(fetchDeliveryOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeliveryOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchDeliveryOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Start shipping
      .addCase(startShipping.pending, (state) => {
        state.loading = true;
      })
      .addCase(startShipping.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(startShipping.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Mark cannot deliver
      .addCase(markCannotDeliver.pending, (state) => {
        state.loading = true;
      })
      .addCase(markCannotDeliver.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(markCannotDeliver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Mark delivered
      .addCase(markDelivered.pending, (state) => {
        state.loading = true;
      })
      .addCase(markDelivered.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(markDelivered.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default deliveryOrderSlice.reducer; 