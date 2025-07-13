import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Async thunks
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get(`${API_URL}/api/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi tải danh sách yêu thích');
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async ({ productId, itemType }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.post(
        `${API_URL}/api/wishlist/add`,
        { productId, itemType },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi thêm vào danh sách yêu thích');
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async ({ productId, itemType }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.delete(
        `${API_URL}/api/wishlist/remove`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { productId, itemType },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi xóa khỏi danh sách yêu thích');
    }
  }
);

export const checkWishlistStatus = createAsyncThunk(
  'wishlist/checkWishlistStatus',
  async ({ productId, itemType }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get(
        `${API_URL}/api/wishlist/check/${productId}/${itemType}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { productId, itemType, isInWishlist: response.data.isInWishlist };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi kiểm tra trạng thái yêu thích');
    }
  }
);

export const clearWishlist = createAsyncThunk(
  'wishlist/clearWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.delete(`${API_URL}/api/wishlist/clear`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi xóa danh sách yêu thích');
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  wishlistStatus: {}, // Lưu trạng thái yêu thích của từng sản phẩm
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateWishlistStatus: (state, action) => {
      const { productId, itemType, isInWishlist } = action.payload;
      const key = `${productId}-${itemType}`;
      state.wishlistStatus[key] = isInWishlist;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.wishlist.items || [];
        // Cập nhật trạng thái yêu thích
        action.payload.wishlist.items.forEach(item => {
          const key = `${item.productId}-${item.itemType}`;
          state.wishlistStatus[key] = true;
        });
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.wishlist.items || [];
        // Cập nhật trạng thái yêu thích
        const removedItem = action.payload.removedItem;
        if (removedItem) {
          const key = `${removedItem.productId}-${removedItem.itemType}`;
          state.wishlistStatus[key] = false;
        }
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Check wishlist status
      .addCase(checkWishlistStatus.fulfilled, (state, action) => {
        const { productId, itemType, isInWishlist } = action.payload;
        const key = `${productId}-${itemType}`;
        state.wishlistStatus[key] = isInWishlist;
      })
      // Clear wishlist
      .addCase(clearWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearWishlist.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.wishlistStatus = {};
      })
      .addCase(clearWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, updateWishlistStatus } = wishlistSlice.actions;
export default wishlistSlice.reducer; 