import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//Fetch all orders (admin only)
export const fetchAllOrders = createAsyncThunk(
  "adminOrders/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || 'Có lỗi xảy ra khi tải danh sách đơn hàng'
      );
    }
  }
);

//update order delivery status
export const updateOrderStatus = createAsyncThunk(
  "adminOrders/updateOrderDeliveryStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      console.log('Updating order status:', { id, status }); // Debug log
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Update response:', response.data); // Debug log
      return response.data.order;
    } catch (error) {
      console.error('Error updating order status:', error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái'
      );
    }
  }
);

//delete an order
export const deleteOrder = createAsyncThunk(
  "adminOrders/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return id;
    } catch (error) {
      console.error('Error deleting order:', error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || 'Có lỗi xảy ra khi xóa đơn hàng'
      );
    }
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState: {
    orders: [],
    totalOrders: 0,
    totalSales: 0,
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
      // Fetch all orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.totalOrders = action.payload.length;
        // Calculate total sales
        const totalSales = action.payload.reduce((acc, order) => {
          return acc + order.totalPrice;
        }, 0);
        state.totalSales = totalSales;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        const orderIndex = state.orders.findIndex(
          (order) => order._id === updatedOrder._id
        );
        if (orderIndex !== -1) {
          state.orders[orderIndex] = updatedOrder;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete order
      .addCase(deleteOrder.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter(
          (order) => order._id !== action.payload
        );
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;