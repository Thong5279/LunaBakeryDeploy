import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk action để lấy tất cả reviews với filter
export const fetchAdminReviews = createAsyncThunk(
  'adminReviews/fetchAdminReviews',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('Vui lòng đăng nhập');
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const params = new URLSearchParams();
      
      // Add filters to params
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });

      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/reviews?${params.toString()}`,
        config
      );

      return data;
    } catch (error) {
      console.error('Error fetching admin reviews:', error);
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Lỗi khi lấy danh sách đánh giá'
      );
    }
  }
);

// Thunk action để lấy chi tiết review
export const fetchReviewById = createAsyncThunk(
  'adminReviews/fetchReviewById',
  async (reviewId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('Vui lòng đăng nhập');
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/reviews/${reviewId}`,
        config
      );

      return data.data;
    } catch (error) {
      console.error('Error fetching review by ID:', error);
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Lỗi khi lấy chi tiết đánh giá'
      );
    }
  }
);

// Thunk action để cập nhật trạng thái review
export const updateReviewStatus = createAsyncThunk(
  'adminReviews/updateReviewStatus',
  async ({ reviewId, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('Vui lòng đăng nhập');
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/reviews/${reviewId}/status`,
        { status },
        config
      );

      return data.data;
    } catch (error) {
      console.error('Error updating review status:', error);
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Lỗi khi cập nhật trạng thái đánh giá'
      );
    }
  }
);

// Thunk action để xóa review
export const deleteReview = createAsyncThunk(
  'adminReviews/deleteReview',
  async (reviewId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('Vui lòng đăng nhập');
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/reviews/${reviewId}`,
        config
      );

      return reviewId;
    } catch (error) {
      console.error('Error deleting review:', error);
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Lỗi khi xóa đánh giá'
      );
    }
  }
);

// Thunk action để lấy thống kê reviews
export const fetchReviewStats = createAsyncThunk(
  'adminReviews/fetchReviewStats',
  async (period = 'month', { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('Vui lòng đăng nhập');
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/reviews/stats/overview?period=${period}`,
        config
      );

      return data.data;
    } catch (error) {
      console.error('Error fetching review stats:', error);
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Lỗi khi lấy thống kê đánh giá'
      );
    }
  }
);

// Initial state
const initialState = {
  reviews: [],
  currentReview: null,
  stats: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  filters: {
    itemType: 'all',
    status: 'all',
    rating: '',
    minRating: '',
    maxRating: '',
    search: '',
    sort: 'date-desc',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 10,
  },
  loading: false,
  error: null,
  actionLoading: false,
  actionError: null,
  successMessage: null,
};

// Slice
const adminReviewSlice = createSlice({
  name: 'adminReviews',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.actionError = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    clearCurrentReview: (state) => {
      state.currentReview = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        itemType: 'all',
        status: 'all',
        rating: '',
        minRating: '',
        maxRating: '',
        search: '',
        sort: 'date-desc',
        startDate: '',
        endDate: '',
        page: 1,
        limit: 10,
      };
    },
    setPage: (state, action) => {
      state.filters.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch reviews
      .addCase(fetchAdminReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
        state.pagination = action.payload.pagination;
        state.stats = action.payload.stats;
      })
      .addCase(fetchAdminReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch review by ID
      .addCase(fetchReviewById.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(fetchReviewById.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.currentReview = action.payload;
      })
      .addCase(fetchReviewById.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })

      // Update review status
      .addCase(updateReviewStatus.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(updateReviewStatus.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Update review in the list
        const index = state.reviews.findIndex(review => review._id === action.payload._id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
        // Update current review if it's the same
        if (state.currentReview && state.currentReview._id === action.payload._id) {
          state.currentReview = action.payload;
        }
        state.successMessage = 'Cập nhật trạng thái đánh giá thành công';
      })
      .addCase(updateReviewStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })

      // Delete review
      .addCase(deleteReview.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Remove review from the list
        state.reviews = state.reviews.filter(review => review._id !== action.payload);
        // Clear current review if it's the same
        if (state.currentReview && state.currentReview._id === action.payload) {
          state.currentReview = null;
        }
        state.successMessage = 'Xóa đánh giá thành công';
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })

      // Fetch review stats
      .addCase(fetchReviewStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchReviewStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearSuccessMessage,
  clearCurrentReview,
  setFilters,
  resetFilters,
  setPage,
} = adminReviewSlice.actions;

export default adminReviewSlice.reducer; 