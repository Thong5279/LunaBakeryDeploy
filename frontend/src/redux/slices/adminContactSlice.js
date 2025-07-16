import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const fetchAdminContacts = createAsyncThunk(
  'adminContact/fetchAdminContacts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/contact/admin`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  }
);

export const updateContactStatus = createAsyncThunk(
  'adminContact/updateContactStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/contact/admin/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  }
);

export const deleteContact = createAsyncThunk(
  'adminContact/deleteContact',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/contact/admin/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  }
);

export const fetchContactStats = createAsyncThunk(
  'adminContact/fetchContactStats',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/contact/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  }
);

// Initial state
const initialState = {
  contacts: [],
  stats: {
    total: 0,
    new: 0,
    read: 0,
    replied: 0,
    recent: 0
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  },
  filters: {
    search: '',
    status: '',
    page: 1
  },
  loading: false,
  error: null,
  actionLoading: false
};

// Slice
const adminContactSlice = createSlice({
  name: 'adminContact',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        status: '',
        page: 1
      };
    }
  },
  extraReducers: (builder) => {
    // Fetch contacts
    builder.addCase(fetchAdminContacts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAdminContacts.fulfilled, (state, action) => {
      state.loading = false;
      state.contacts = action.payload.contacts;
      state.pagination = action.payload.pagination;
    });
    builder.addCase(fetchAdminContacts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update contact status
    builder.addCase(updateContactStatus.pending, (state) => {
      state.actionLoading = true;
      state.error = null;
    });
    builder.addCase(updateContactStatus.fulfilled, (state, action) => {
      state.actionLoading = false;
      const updatedContact = action.payload.contact;
      const index = state.contacts.findIndex(contact => contact._id === updatedContact._id);
      if (index !== -1) {
        state.contacts[index] = updatedContact;
      }
    });
    builder.addCase(updateContactStatus.rejected, (state, action) => {
      state.actionLoading = false;
      state.error = action.payload;
    });

    // Delete contact
    builder.addCase(deleteContact.pending, (state) => {
      state.actionLoading = true;
      state.error = null;
    });
    builder.addCase(deleteContact.fulfilled, (state, action) => {
      state.actionLoading = false;
      state.contacts = state.contacts.filter(contact => contact._id !== action.payload);
    });
    builder.addCase(deleteContact.rejected, (state, action) => {
      state.actionLoading = false;
      state.error = action.payload;
    });

    // Fetch stats
    builder.addCase(fetchContactStats.fulfilled, (state, action) => {
      state.stats = action.payload.stats;
    });
  }
});

export const { clearError, setFilters, clearFilters } = adminContactSlice.actions;
export default adminContactSlice.reducer; 