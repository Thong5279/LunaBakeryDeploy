import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/admin/recipes`;

// Helper function để lấy token
const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
  },
});

// Fetch all recipes with pagination and filters
export const fetchAdminRecipes = createAsyncThunk(
  "adminRecipe/fetchRecipes",
  async ({ page = 1, limit = 10, search = "", category = "", status = "" } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(category && { category }),
        ...(status && { status }),
      });

      const response = await axios.get(`${API_URL}?${params}`, getAuthConfig());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi tải danh sách công thức"
      );
    }
  }
);

// Fetch single recipe
export const fetchRecipeById = createAsyncThunk(
  "adminRecipe/fetchRecipeById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`, getAuthConfig());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi tải công thức"
      );
    }
  }
);

// Create new recipe
export const createRecipe = createAsyncThunk(
  "adminRecipe/createRecipe",
  async (recipeData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, recipeData, getAuthConfig());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi tạo công thức"
      );
    }
  }
);

// Update recipe
export const updateRecipe = createAsyncThunk(
  "adminRecipe/updateRecipe",
  async ({ id, recipeData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, recipeData, getAuthConfig());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi cập nhật công thức"
      );
    }
  }
);

// Delete recipe
export const deleteRecipe = createAsyncThunk(
  "adminRecipe/deleteRecipe",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi xóa công thức"
      );
    }
  }
);

// Toggle recipe status
export const toggleRecipeStatus = createAsyncThunk(
  "adminRecipe/toggleStatus",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}/toggle-status`, {}, getAuthConfig());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi thay đổi trạng thái"
      );
    }
  }
);

// Toggle recipe publish status
export const toggleRecipePublish = createAsyncThunk(
  "adminRecipe/togglePublish",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}/toggle-publish`, {}, getAuthConfig());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi thay đổi trạng thái công khai"
      );
    }
  }
);

// Fetch recipe statistics
export const fetchRecipeStats = createAsyncThunk(
  "adminRecipe/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/stats/overview`, getAuthConfig());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi tải thống kê"
      );
    }
  }
);

const adminRecipeSlice = createSlice({
  name: "adminRecipe",
  initialState: {
    recipes: [],
    currentRecipe: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
    stats: {
      totalRecipes: 0,
      activeRecipes: 0,
      publishedRecipes: 0,
      inactiveRecipes: 0,
      unpublishedRecipes: 0,
      categoryStats: [],
    },
    filters: {
      search: "",
      category: "",
      status: "",
      page: 1,
      limit: 10,
    },
    loading: false,
    error: null,
    actionLoading: false, // For delete, toggle actions
    successMessage: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        search: "",
        category: "",
        status: "",
        page: 1,
        limit: 10,
      };
    },
    clearCurrentRecipe: (state) => {
      state.currentRecipe = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch recipes
      .addCase(fetchAdminRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = action.payload.recipes;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAdminRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single recipe
      .addCase(fetchRecipeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRecipe = action.payload;
      })
      .addCase(fetchRecipeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create recipe
      .addCase(createRecipe.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createRecipe.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.recipes.unshift(action.payload.recipe);
        state.successMessage = action.payload.message;
      })
      .addCase(createRecipe.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Update recipe
      .addCase(updateRecipe.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateRecipe.fulfilled, (state, action) => {
        state.actionLoading = false;
        const index = state.recipes.findIndex(
          (recipe) => recipe._id === action.payload.recipe._id
        );
        if (index !== -1) {
          state.recipes[index] = action.payload.recipe;
        }
        state.currentRecipe = action.payload.recipe;
        state.successMessage = action.payload.message;
      })
      .addCase(updateRecipe.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Delete recipe
      .addCase(deleteRecipe.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.recipes = state.recipes.filter(
          (recipe) => recipe._id !== action.payload.id
        );
        state.successMessage = action.payload.message;
      })
      .addCase(deleteRecipe.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Toggle status
      .addCase(toggleRecipeStatus.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(toggleRecipeStatus.fulfilled, (state, action) => {
        state.actionLoading = false;
        const index = state.recipes.findIndex(
          (recipe) => recipe._id === action.payload.recipe._id
        );
        if (index !== -1) {
          state.recipes[index].status = action.payload.recipe.status;
        }
        state.successMessage = action.payload.message;
      })
      .addCase(toggleRecipeStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Toggle publish
      .addCase(toggleRecipePublish.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(toggleRecipePublish.fulfilled, (state, action) => {
        state.actionLoading = false;
        const index = state.recipes.findIndex(
          (recipe) => recipe._id === action.payload.recipe._id
        );
        if (index !== -1) {
          state.recipes[index].isPublished = action.payload.recipe.isPublished;
          state.recipes[index].publishedAt = action.payload.recipe.publishedAt;
        }
        state.successMessage = action.payload.message;
      })
      .addCase(toggleRecipePublish.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Fetch stats
      .addCase(fetchRecipeStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipeStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchRecipeStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearSuccessMessage,
  setFilters,
  resetFilters,
  clearCurrentRecipe,
} = adminRecipeSlice.actions;

export default adminRecipeSlice.reducer; 