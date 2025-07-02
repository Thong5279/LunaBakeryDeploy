import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000';

// Fetch all recipes for baker
export const fetchBakerRecipes = createAsyncThunk(
  'bakerRecipes/fetchBakerRecipes',
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const { 
        page = 1, 
        limit = 12, 
        search = '', 
        category = 'all', 
        difficulty = 'all',
        sortBy = 'newest'
      } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(category !== 'all' && { category }),
        ...(difficulty !== 'all' && { difficulty }),
        sortBy
      });

      const response = await fetch(`${API_URL}/api/baker/recipes?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi tải danh sách công thức');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch recipe details for baker
export const fetchBakerRecipeDetails = createAsyncThunk(
  'bakerRecipes/fetchBakerRecipeDetails',
  async (recipeId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      
      const response = await fetch(`${API_URL}/api/baker/recipes/${recipeId}`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi tải chi tiết công thức');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch recipe categories for baker
export const fetchBakerRecipeCategories = createAsyncThunk(
  'bakerRecipes/fetchBakerRecipeCategories',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      
      const response = await fetch(`${API_URL}/api/baker/recipes/categories/list`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi tải danh mục công thức');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Quick search recipes for baker
export const searchBakerRecipes = createAsyncThunk(
  'bakerRecipes/searchBakerRecipes',
  async (searchQuery, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      
      const response = await fetch(`${API_URL}/api/baker/recipes/search/quick?q=${encodeURIComponent(searchQuery)}`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi tìm kiếm công thức');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  recipes: [],
  selectedRecipe: null,
  categories: [],
  searchResults: [],
  loading: false,
  detailsLoading: false,
  searchLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalRecipes: 0,
    hasNextPage: false,
    hasPrevPage: false
  },
  filters: {
    search: '',
    category: 'all',
    difficulty: 'all',
    sortBy: 'newest'
  }
};

const bakerRecipeSlice = createSlice({
  name: 'bakerRecipes',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        category: 'all',
        difficulty: 'all',
        sortBy: 'newest'
      };
    },
    clearSelectedRecipe: (state) => {
      state.selectedRecipe = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Baker Recipes
      .addCase(fetchBakerRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBakerRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = action.payload.recipes;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalRecipes: action.payload.totalRecipes,
          hasNextPage: action.payload.hasNextPage,
          hasPrevPage: action.payload.hasPrevPage
        };
      })
      .addCase(fetchBakerRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.recipes = [];
      })
      
      // Fetch Baker Recipe Details
      .addCase(fetchBakerRecipeDetails.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
      })
      .addCase(fetchBakerRecipeDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedRecipe = action.payload;
      })
      .addCase(fetchBakerRecipeDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload;
        state.selectedRecipe = null;
      })
      
      // Fetch Baker Recipe Categories
      .addCase(fetchBakerRecipeCategories.fulfilled, (state, action) => {
        state.categories = action.payload.categories;
      })
      .addCase(fetchBakerRecipeCategories.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Search Baker Recipes
      .addCase(searchBakerRecipes.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(searchBakerRecipes.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.recipes;
      })
      .addCase(searchBakerRecipes.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload;
        state.searchResults = [];
      });
  },
});

export const {
  setFilters,
  clearFilters,
  clearSelectedRecipe,
  clearSearchResults,
  clearError
} = bakerRecipeSlice.actions;

export default bakerRecipeSlice.reducer; 