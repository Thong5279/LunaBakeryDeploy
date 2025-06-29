import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Helper function để lấy token
const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
  },
});

// Async thunks

// Lấy danh sách inventory
export const fetchInventory = createAsyncThunk(
  "inventory/fetchInventory",
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/inventory?${queryParams}`,
        getAuthConfig()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi lấy danh sách kho"
      );
    }
  }
);

// Lấy thống kê kho
export const fetchInventoryStatistics = createAsyncThunk(
  "inventory/fetchStatistics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/inventory/statistics`,
        getAuthConfig()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi lấy thống kê kho"
      );
    }
  }
);

// Tạo item mới trong kho
export const createInventoryItem = createAsyncThunk(
  "inventory/createItem",
  async (itemData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/inventory`,
        itemData,
        getAuthConfig()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi tạo item mới"
      );
    }
  }
);

// Cập nhật item trong kho
export const updateInventoryItem = createAsyncThunk(
  "inventory/updateItem",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/inventory/${id}`,
        data,
        getAuthConfig()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi cập nhật item"
      );
    }
  }
);

// Thêm giao dịch kho
export const addTransaction = createAsyncThunk(
  "inventory/addTransaction",
  async ({ id, transactionData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/inventory/${id}/transaction`,
        transactionData,
        getAuthConfig()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi thêm giao dịch"
      );
    }
  }
);

// Lấy lịch sử giao dịch
export const fetchTransactions = createAsyncThunk(
  "inventory/fetchTransactions",
  async ({ id, params = {} }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/inventory/${id}/transactions?${queryParams}`,
        getAuthConfig()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi lấy lịch sử giao dịch"
      );
    }
  }
);

// Xóa item khỏi kho
export const deleteInventoryItem = createAsyncThunk(
  "inventory/deleteItem",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/inventory/${id}`,
        getAuthConfig()
      );
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi xóa item"
      );
    }
  }
);

// Lấy cảnh báo
export const fetchAlerts = createAsyncThunk(
  "inventory/fetchAlerts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/inventory/alerts`,
        getAuthConfig()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi lấy cảnh báo"
      );
    }
  }
);

// Đồng bộ sản phẩm
export const syncProducts = createAsyncThunk(
  "inventory/syncProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/inventory/sync-products`,
        {},
        getAuthConfig()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi đồng bộ sản phẩm"
      );
    }
  }
);

const inventorySlice = createSlice({
  name: "inventory",
  initialState: {
    // Danh sách items
    items: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      total: 0,
      hasNext: false,
      hasPrev: false
    },
    
    // Thống kê
    statistics: {
      totalItems: 0,
      lowStockItems: 0,
      slowMovingItems: 0,
      expiredItems: 0,
      totalValue: 0,
      slowMovingItemsList: [],
      lowStockItemsList: [],
      alerts: []
    },
    
    // Cảnh báo
    alerts: [],
    
    // Lịch sử giao dịch
    transactions: [],
    transactionPagination: {
      currentPage: 1,
      totalPages: 1,
      total: 0
    },
    
    // UI states
    loading: false,
    statisticsLoading: false,
    alertsLoading: false,
    transactionsLoading: false,
    
    // Error states
    error: null,
    statisticsError: null,
    alertsError: null,
    transactionsError: null,
    
    // Thông báo thành công
    successMessage: null,
    
    // Selected item
    selectedItem: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.statisticsError = null;
      state.alertsError = null;
      state.transactionsError = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },
    clearSelectedItem: (state) => {
      state.selectedItem = null;
    },
    // Real-time updates cho stock
    updateItemStock: (state, action) => {
      const { itemId, newStock } = action.payload;
      const item = state.items.find(item => item._id === itemId);
      if (item) {
        item.currentStock = newStock;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch inventory
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.inventory;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch statistics
      .addCase(fetchInventoryStatistics.pending, (state) => {
        state.statisticsLoading = true;
        state.statisticsError = null;
      })
      .addCase(fetchInventoryStatistics.fulfilled, (state, action) => {
        state.statisticsLoading = false;
        state.statistics = action.payload;
      })
      .addCase(fetchInventoryStatistics.rejected, (state, action) => {
        state.statisticsLoading = false;
        state.statisticsError = action.payload;
      })
      
      // Create item
      .addCase(createInventoryItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInventoryItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload.inventoryItem);
        state.successMessage = action.payload.message;
      })
      .addCase(createInventoryItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update item
      .addCase(updateInventoryItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInventoryItem.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(
          item => item._id === action.payload.inventoryItem._id
        );
        if (index !== -1) {
          state.items[index] = action.payload.inventoryItem;
        }
        state.successMessage = action.payload.message;
      })
      .addCase(updateInventoryItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add transaction
      .addCase(addTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.loading = false;
        // Cập nhật item trong danh sách
        const index = state.items.findIndex(
          item => item._id === action.payload.inventoryItem._id
        );
        if (index !== -1) {
          state.items[index] = action.payload.inventoryItem;
        }
        state.successMessage = action.payload.message;
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.transactionsLoading = true;
        state.transactionsError = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactionsLoading = false;
        state.transactions = action.payload.transactions;
        state.transactionPagination = action.payload.pagination;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.transactionsLoading = false;
        state.transactionsError = action.payload;
      })
      
      // Delete item
      .addCase(deleteInventoryItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInventoryItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item._id !== action.payload);
        state.successMessage = "Xóa item thành công";
      })
      .addCase(deleteInventoryItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch alerts
      .addCase(fetchAlerts.pending, (state) => {
        state.alertsLoading = true;
        state.alertsError = null;
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.alertsLoading = false;
        state.alerts = action.payload;
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.alertsLoading = false;
        state.alertsError = action.payload;
      })
      
      // Sync products
      .addCase(syncProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = `${action.payload.message}: Đồng bộ ${action.payload.syncCount} sản phẩm`;
      })
      .addCase(syncProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearSuccessMessage,
  setSelectedItem,
  clearSelectedItem,
  updateItemStock
} = inventorySlice.actions;

export default inventorySlice.reducer;
