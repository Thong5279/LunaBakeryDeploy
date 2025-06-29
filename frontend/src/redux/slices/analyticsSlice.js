import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000';

// Async thunks
export const fetchRevenue = createAsyncThunk(
  'analytics/fetchRevenue',
  async ({ period, year, month, quarter }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');

      if (!token) {
        throw new Error('No token found');
      }

      const params = new URLSearchParams({ period });
      if (year) params.append('year', year);
      if (month) params.append('month', month);
      if (quarter) params.append('quarter', quarter);

      const response = await fetch(`${backendURL}/api/analytics/revenue?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch revenue data');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSummary = createAsyncThunk(
  'analytics/fetchSummary',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');

      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${backendURL}/api/analytics/summary`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch summary data');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOrderStatus = createAsyncThunk(
  'analytics/fetchOrderStatus',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');

      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${backendURL}/api/analytics/order-status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch order status data');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductSales = createAsyncThunk(
  'analytics/fetchProductSales',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');

      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${backendURL}/api/analytics/product-sales`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch product sales data');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchIngredientInventory = createAsyncThunk(
  'analytics/fetchIngredientInventory',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');

      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${backendURL}/api/analytics/ingredient-inventory`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch ingredient inventory data');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  revenue: {
    data: [],
    period: 'month',
    loading: false,
    error: null,
  },
  summary: {
    data: null,
    loading: false,
    error: null,
  },
  orderStatus: {
    data: [],
    loading: false,
    error: null,
  },
  productSales: {
    data: null,
    loading: false,
    error: null,
  },
  ingredientInventory: {
    data: null,
    loading: false,
    error: null,
  },
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearAnalyticsError: (state) => {
      state.revenue.error = null;
      state.summary.error = null;
      state.orderStatus.error = null;
      state.productSales.error = null;
      state.ingredientInventory.error = null;
    },
    setPeriod: (state, action) => {
      state.revenue.period = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Revenue
      .addCase(fetchRevenue.pending, (state) => {
        state.revenue.loading = true;
        state.revenue.error = null;
      })
      .addCase(fetchRevenue.fulfilled, (state, action) => {
        state.revenue.loading = false;
        state.revenue.data = action.payload.data;
        state.revenue.period = action.payload.period;
      })
      .addCase(fetchRevenue.rejected, (state, action) => {
        state.revenue.loading = false;
        state.revenue.error = action.payload;
      })
      // Summary
      .addCase(fetchSummary.pending, (state) => {
        state.summary.loading = true;
        state.summary.error = null;
      })
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.summary.loading = false;
        state.summary.data = action.payload;
      })
      .addCase(fetchSummary.rejected, (state, action) => {
        state.summary.loading = false;
        state.summary.error = action.payload;
      })
      // Order Status
      .addCase(fetchOrderStatus.pending, (state) => {
        state.orderStatus.loading = true;
        state.orderStatus.error = null;
      })
      .addCase(fetchOrderStatus.fulfilled, (state, action) => {
        state.orderStatus.loading = false;
        state.orderStatus.data = action.payload.data;
      })
      .addCase(fetchOrderStatus.rejected, (state, action) => {
        state.orderStatus.loading = false;
        state.orderStatus.error = action.payload;
      })
      // Product Sales
      .addCase(fetchProductSales.pending, (state) => {
        state.productSales.loading = true;
        state.productSales.error = null;
      })
      .addCase(fetchProductSales.fulfilled, (state, action) => {
        state.productSales.loading = false;
        state.productSales.data = action.payload.data;
      })
      .addCase(fetchProductSales.rejected, (state, action) => {
        state.productSales.loading = false;
        state.productSales.error = action.payload;
      })
      // Ingredient Inventory
      .addCase(fetchIngredientInventory.pending, (state) => {
        state.ingredientInventory.loading = true;
        state.ingredientInventory.error = null;
      })
      .addCase(fetchIngredientInventory.fulfilled, (state, action) => {
        state.ingredientInventory.loading = false;
        state.ingredientInventory.data = action.payload.data;
      })
      .addCase(fetchIngredientInventory.rejected, (state, action) => {
        state.ingredientInventory.loading = false;
        state.ingredientInventory.error = action.payload;
      });
  },
});

export const { clearAnalyticsError, setPeriod } = analyticsSlice.actions;
export default analyticsSlice.reducer; 