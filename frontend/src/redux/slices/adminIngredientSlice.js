import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('userToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

// Async thunks
export const fetchAdminIngredients = createAsyncThunk(
  'adminIngredients/fetchIngredients',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, category, status, search, stock, sort } = params;
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (category && category !== 'all') queryParams.append('category', category);
      if (status && status !== 'all') queryParams.append('status', status);
      if (search) queryParams.append('search', search);
      if (stock && stock !== 'all') queryParams.append('stock', stock);
      if (sort) queryParams.append('sort', sort);

      const response = await axios.get(
        `${API_URL}/api/admin/ingredients?${queryParams.toString()}`,
        getAuthHeaders()
      );
      
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi khi tải danh sách nguyên liệu';
      return rejectWithValue(message);
    }
  }
);

export const fetchIngredientById = createAsyncThunk(
  'adminIngredients/fetchById',
  async (ingredientId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/admin/ingredients/${ingredientId}`,
        getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi khi tải thông tin nguyên liệu';
      return rejectWithValue(message);
    }
  }
);

export const createIngredient = createAsyncThunk(
  'adminIngredients/create',
  async (ingredientData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/admin/ingredients`,
        ingredientData,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi khi tạo nguyên liệu';
      return rejectWithValue(message);
    }
  }
);

export const updateIngredient = createAsyncThunk(
  'adminIngredients/update',
  async ({ ingredientId, ingredientData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/admin/ingredients/${ingredientId}`,
        ingredientData,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi khi cập nhật nguyên liệu';
      return rejectWithValue(message);
    }
  }
);

export const deleteIngredient = createAsyncThunk(
  'adminIngredients/delete',
  async (ingredientId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_URL}/api/admin/ingredients/${ingredientId}`,
        getAuthHeaders()
      );
      return { ingredientId, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi khi xóa nguyên liệu';
      return rejectWithValue(message);
    }
  }
);

export const fetchIngredientStats = createAsyncThunk(
  'adminIngredients/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/admin/ingredients/stats/overview`,
        getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi khi tải thống kê nguyên liệu';
      return rejectWithValue(message);
    }
  }
);

// Initial state
const initialState = {
  ingredients: [],
  currentIngredient: null,
  stats: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  },
  filters: {
    category: 'all',
    status: 'all',
    search: '',
    stock: 'all',
    sort: 'name'
  },
  loading: false,
  error: null,
  actionLoading: false,
  actionError: null
};

// Slice
const adminIngredientSlice = createSlice({
  name: 'adminIngredients',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.actionError = null;
    },
    clearCurrentIngredient: (state) => {
      state.currentIngredient = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        category: 'all',
        status: 'all',
        search: '',
        stock: 'all',
        sort: 'name'
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch ingredients
      .addCase(fetchAdminIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAdminIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch ingredient by ID
      .addCase(fetchIngredientById.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(fetchIngredientById.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.currentIngredient = action.payload;
      })
      .addCase(fetchIngredientById.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })

      // Create ingredient
      .addCase(createIngredient.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(createIngredient.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Add new ingredient to the list
        state.ingredients.unshift(action.payload.data);
        // Update pagination total
        state.pagination.total += 1;
      })
      .addCase(createIngredient.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })

      // Update ingredient
      .addCase(updateIngredient.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(updateIngredient.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Update ingredient in the list
        const index = state.ingredients.findIndex(
          ingredient => ingredient._id === action.payload.data._id
        );
        if (index !== -1) {
          state.ingredients[index] = action.payload.data;
        }
        // Update current ingredient if it's the same
        if (state.currentIngredient?._id === action.payload.data._id) {
          state.currentIngredient = action.payload.data;
        }
      })
      .addCase(updateIngredient.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })

      // Delete ingredient
      .addCase(deleteIngredient.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(deleteIngredient.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Remove ingredient from the list
        state.ingredients = state.ingredients.filter(
          ingredient => ingredient._id !== action.payload.ingredientId
        );
        // Update pagination total
        state.pagination.total -= 1;
        // Clear current ingredient if it's the deleted one
        if (state.currentIngredient?._id === action.payload.ingredientId) {
          state.currentIngredient = null;
        }
      })
      .addCase(deleteIngredient.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })

      // Fetch stats
      .addCase(fetchIngredientStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIngredientStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchIngredientStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearCurrentIngredient, setFilters, resetFilters } = adminIngredientSlice.actions;
export default adminIngredientSlice.reducer; 