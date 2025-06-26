import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000';

// Async thunks
export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 12, category, search, stock, sort } = params;
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (category && category !== 'all') queryParams.append('category', category);
      if (search) queryParams.append('search', search);
      if (stock && stock !== 'all') queryParams.append('stock', stock);
      if (sort) queryParams.append('sort', sort);

      const response = await axios.get(
        `${API_URL}/api/ingredients?${queryParams.toString()}`
      );
      
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi khi tải danh sách nguyên liệu';
      return rejectWithValue(message);
    }
  }
);

export const fetchIngredientDetails = createAsyncThunk(
  'ingredients/fetchIngredientDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/ingredients/${id}`);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi khi tải chi tiết nguyên liệu';
      return rejectWithValue(message);
    }
  }
);

export const fetchSimilarIngredients = createAsyncThunk(
  'ingredients/fetchSimilarIngredients',
  async ({ id, category }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/ingredients?category=${category}&limit=8`
      );
      // Filter out the current ingredient
      const similarIngredients = response.data.data.filter(ing => ing._id !== id);
      return similarIngredients.slice(0, 6); // Take only 6 similar ingredients
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi khi tải nguyên liệu tương tự';
      return rejectWithValue(message);
    }
  }
);

export const fetchIngredientCategories = createAsyncThunk(
  'ingredients/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/ingredients/categories`);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi khi tải danh mục nguyên liệu';
      return rejectWithValue(message);
    }
  }
);

export const fetchIngredientStats = createAsyncThunk(
  'ingredients/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/ingredients/stats`);
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
  selectedIngredient: null,
  similarIngredients: [],
  categories: [],
  stats: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  },
  filters: {
    category: 'all',
    search: '',
    stock: 'all',
    sort: 'name-asc'
  },
  loading: false,
  error: null
};

// Slice
const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        category: 'all',
        search: '',
        stock: 'all',
        sort: 'name-asc'
      };
    },
    clearSelectedIngredient: (state) => {
      state.selectedIngredient = null;
      state.similarIngredients = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch ingredients
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch ingredient details
      .addCase(fetchIngredientDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredientDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedIngredient = action.payload;
      })
      .addCase(fetchIngredientDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch similar ingredients
      .addCase(fetchSimilarIngredients.pending, (state) => {
        // Don't set loading for similar ingredients to avoid UI flicker
      })
      .addCase(fetchSimilarIngredients.fulfilled, (state, action) => {
        state.similarIngredients = action.payload;
      })
      .addCase(fetchSimilarIngredients.rejected, (state, action) => {
        // Silently fail for similar ingredients
        console.error('Failed to fetch similar ingredients:', action.payload);
      })

      // Fetch categories
      .addCase(fetchIngredientCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIngredientCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchIngredientCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
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

export const { clearError, setFilters, resetFilters, clearSelectedIngredient } = ingredientsSlice.actions;
export default ingredientsSlice.reducer; 