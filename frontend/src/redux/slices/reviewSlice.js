import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk action để tạo đánh giá mới
export const createReview = createAsyncThunk(
    'reviews/createReview',
    async ({ orderId, productId, rating, comment, itemType = 'Product' }, { rejectWithValue }) => {
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

            console.log('📝 Gửi request tạo review:', { 
                product: productId,
                order: orderId,
                rating, 
                comment,
                itemType 
            });

            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/reviews`,
                { 
                    product: productId,
                    order: orderId,
                    rating, 
                    comment,
                    itemType 
                },
                config
            );

            console.log('✅ Tạo review thành công:', data);
            return data;
        } catch (error) {
            console.error('❌ Lỗi khi tạo review:', error.response?.data || error.message);
            if (error.response?.status === 401) {
                return rejectWithValue('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
            }
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Đã xảy ra lỗi khi tạo đánh giá'
            );
        }
    }
);

// Thunk action để lấy đánh giá của sản phẩm/nguyên liệu
export const getProductReviews = createAsyncThunk(
    'reviews/getProductReviews',
    async ({ productId, itemType = 'Product' }, { rejectWithValue }) => {
        try {
            console.log('🔍 Lấy reviews cho:', { productId, itemType });

            // Kiểm tra params
            if (!productId) {
                throw new Error('Thiếu productId');
            }

            const params = new URLSearchParams({
                product: productId,
                itemType: itemType,
                status: 'approved'
            });

            const { data } = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/reviews?${params.toString()}`
            );

            // Kiểm tra dữ liệu trả về
            if (!Array.isArray(data)) {
                console.error('❌ Dữ liệu không đúng định dạng:', data);
                throw new Error('Dữ liệu không đúng định dạng');
            }

            console.log('✅ Lấy reviews thành công:', data);
            return data;
        } catch (error) {
            console.error('❌ Lỗi khi lấy reviews:', error.response?.data || error.message);
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Đã xảy ra lỗi khi lấy đánh giá'
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

            console.log('🔍 Lấy reviews cho đơn hàng:', orderId);
            const { data } = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/reviews?order=${orderId}`,
                config
            );
            console.log('✅ Lấy reviews đơn hàng thành công:', data);
            return data;
        } catch (error) {
            console.error('❌ Lỗi khi lấy reviews đơn hàng:', error.response?.data || error.message);
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
        lastCreatedReview: null
    },
    reducers: {
        resetReviewState: (state) => {
            state.success = false;
            state.error = null;
            state.lastCreatedReview = null;
        },
        clearReviews: (state) => {
            state.reviews = [];
            state.loading = false;
            state.error = null;
            state.success = false;
            state.lastCreatedReview = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create review
            .addCase(createReview.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createReview.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.lastCreatedReview = action.payload;
                // Thêm đánh giá mới vào đầu danh sách
                state.reviews = [action.payload, ...state.reviews];
            })
            .addCase(createReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })
            // Get product reviews
            .addCase(getProductReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProductReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload;
            })
            .addCase(getProductReviews.rejected, (state, action) => {
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

export const { resetReviewState, clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer; 