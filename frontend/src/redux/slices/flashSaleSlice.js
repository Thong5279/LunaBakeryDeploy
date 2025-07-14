import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000';

// Async thunks
export const createFlashSale = createAsyncThunk(
  'flashSale/create',
  async (flashSaleData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.post(`${API_URL}/api/flash-sales`, flashSaleData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi tạo flash sale');
    }
  }
);

export const fetchFlashSales = createAsyncThunk(
  'flashSale/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get(`${API_URL}/api/flash-sales`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi lấy danh sách flash sales');
    }
  }
);

export const fetchFlashSaleById = createAsyncThunk(
  'flashSale/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get(`${API_URL}/api/flash-sales/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi lấy thông tin flash sale');
    }
  }
);

export const updateFlashSale = createAsyncThunk(
  'flashSale/update',
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.put(`${API_URL}/api/flash-sales/${id}`, updateData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật flash sale');
    }
  }
);

export const deleteFlashSale = createAsyncThunk(
  'flashSale/delete',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.delete(`${API_URL}/api/flash-sales/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi xóa flash sale');
    }
  }
);

export const fetchAvailableItems = createAsyncThunk(
  'flashSale/fetchAvailableItems',
  async ({ search, category, type }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (type) params.append('type', type);

      const response = await axios.get(`${API_URL}/api/flash-sales/items/available?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi lấy danh sách items');
    }
  }
);

export const fetchActiveFlashSales = createAsyncThunk(
  'flashSale/fetchActive',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/flash-sales/active/active`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi lấy active flash sales');
    }
  }
);

const initialState = {
  flashSales: [],
  selectedFlashSale: null,
  availableItems: {
    products: [],
    ingredients: []
  },
  activeFlashSales: [],
  loading: false,
  error: null,
  success: false,
  message: '',
};

const flashSaleSlice = createSlice({
  name: 'flashSale',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.message = '';
    },
    clearSelectedFlashSale: (state) => {
      state.selectedFlashSale = null;
    },
    clearAvailableItems: (state) => {
      state.availableItems = {
        products: [],
        ingredients: []
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Flash Sale
      .addCase(createFlashSale.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFlashSale.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.flashSales.unshift(action.payload.flashSale);
      })
      .addCase(createFlashSale.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch All Flash Sales
      .addCase(fetchFlashSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlashSales.fulfilled, (state, action) => {
        state.loading = false;
        state.flashSales = action.payload;
      })
      .addCase(fetchFlashSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Flash Sale by ID
      .addCase(fetchFlashSaleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlashSaleById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedFlashSale = action.payload;
      })
      .addCase(fetchFlashSaleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Flash Sale
      .addCase(updateFlashSale.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFlashSale.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        const index = state.flashSales.findIndex(fs => fs._id === action.payload.flashSale._id);
        if (index !== -1) {
          state.flashSales[index] = action.payload.flashSale;
        }
      })
      .addCase(updateFlashSale.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Flash Sale
      .addCase(deleteFlashSale.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFlashSale.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Flash sale đã được xóa thành công!';
        state.flashSales = state.flashSales.filter(fs => fs._id !== action.payload);
      })
      .addCase(deleteFlashSale.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Available Items
      .addCase(fetchAvailableItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableItems.fulfilled, (state, action) => {
        state.loading = false;
        state.availableItems = action.payload;
      })
      .addCase(fetchAvailableItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Active Flash Sales
      .addCase(fetchActiveFlashSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveFlashSales.fulfilled, (state, action) => {
        state.loading = false;
        state.activeFlashSales = action.payload;
      })
      .addCase(fetchActiveFlashSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearError, 
  clearSuccess, 
  clearSelectedFlashSale, 
  clearAvailableItems 
} = flashSaleSlice.actions;

export default flashSaleSlice.reducer; 