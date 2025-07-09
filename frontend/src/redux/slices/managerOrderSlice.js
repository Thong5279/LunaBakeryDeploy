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
        const error = await response.json();
        throw new Error(error.message || 'Không thể tải danh sách đơn hàng');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      return rejectWithValue(error.message || 'Có lỗi xảy ra khi tải danh sách đơn hàng');
    }
  }
);

export const approveOrder = createAsyncThunk(
  'managerOrders/approveOrder',
  async (orderId, { getState, rejectWithValue }) => {
    try {
      console.log('Approving order:', orderId); // Debug log
      const { auth } = getState();
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/manager/orders/${orderId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Không thể duyệt đơn hàng');
      }

      const data = await response.json();
      console.log('Order approved:', data); // Debug log
      return data;
    } catch (error) {
      console.error('Error approving order:', error);
      return rejectWithValue(error.message || 'Có lỗi xảy ra khi duyệt đơn hàng');
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'managerOrders/cancelOrder',
  async (orderId, { getState, rejectWithValue }) => {
    try {
      console.log('Cancelling order:', orderId); // Debug log
      const { auth } = getState();
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/manager/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Không thể hủy đơn hàng');
      }

      const data = await response.json();
      console.log('Order cancelled:', data); // Debug log
      return data;
    } catch (error) {
      console.error('Error cancelling order:', error);
      return rejectWithValue(error.message || 'Có lỗi xảy ra khi hủy đơn hàng');
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
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
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
        state.error = null;
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
        state.error = null;
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

export const { clearError } = managerOrderSlice.actions;
export default managerOrderSlice.reducer; 