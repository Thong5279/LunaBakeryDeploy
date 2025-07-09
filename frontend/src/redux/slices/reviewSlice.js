import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk action để tạo đánh giá mới
export const createReview = createAsyncThunk(
    'reviews/createReview',
    async ({ orderId, productId, rating, comment }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                throw new Error('Vui lòng đăng nhập để đánh giá sản phẩm');
            }

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };

            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}/products/${productId}/reviews`,
                { rating, comment },
                config
            );

            return data;
        } catch (error) {
            if (error.response?.status === 401) {
                return rejectWithValue('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
            }
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Đã xảy ra lỗi khi tạo đánh giá'
            );
        }
    }
);

// Thunk action để lấy đánh giá của đơn hàng
export const getOrderReviews = createAsyncThunk(
    'reviews/getOrderReviews',
    async (orderId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                throw new Error('Vui lòng đăng nhập để xem đánh giá');
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const { data } = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}/reviews`,
                config
            );

            return data;
        } catch (error) {
            if (error.response?.status === 401) {
                return rejectWithValue('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
            }
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Đã xảy ra lỗi khi lấy đánh giá'
            );
        }
    }
);

const reviewSlice = createSlice({
    name: 'reviews',
    initialState: {
        reviews: [],
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        resetReviewState: (state) => {
            state.success = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create review
            .addCase(createReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createReview.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.reviews.push(action.payload.review);
            })
            .addCase(createReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get order reviews
            .addCase(getOrderReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrderReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload;
            })
            .addCase(getOrderReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetReviewState } = reviewSlice.actions;
export default reviewSlice.reducer; 