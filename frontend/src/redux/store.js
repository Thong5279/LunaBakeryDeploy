import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productsReducer from './slices/productsSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import cartReducer from './slices/cartSlice';
import checkoutReducer from './slices/checkoutSlice';
import orderReducer from './slices/orderSlice';
import adminReducer from './slices/adminSlice';
import adminProductReducer from './slices/adminProductSlice';
import adminOrderReducer from './slices/adminOrderSlice';
import adminIngredientReducer from './slices/adminIngredientSlice';
import adminRecipeReducer from './slices/adminRecipeSlice';
import adminContactReducer from './slices/adminContactSlice';
import analyticsReducer from './slices/analyticsSlice';
import inventoryReducer from './slices/inventorySlice';
import managerOrderReducer from './slices/managerOrderSlice';
import bakerOrderReducer from './slices/bakerOrderSlice';
import bakerRecipeReducer from './slices/bakerRecipeSlice';
import deliveryOrderReducer from './slices/deliveryOrderSlice';
import reviewReducer from './slices/reviewSlice';
import adminReviewReducer from './slices/adminReviewSlice';
import wishlistReducer from './slices/wishlistSlice';
import flashSaleReducer from './slices/flashSaleSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productsReducer,
        ingredients: ingredientsReducer,
        cart : cartReducer,
        checkout: checkoutReducer,
        orders: orderReducer,
        admin: adminReducer,
        adminProducts: adminProductReducer,
        adminOrders: adminOrderReducer,
        adminIngredients: adminIngredientReducer,
        adminRecipes: adminRecipeReducer,
        adminContacts: adminContactReducer,
        analytics: analyticsReducer,
        inventory: inventoryReducer,
        managerOrders: managerOrderReducer,
        bakerOrders: bakerOrderReducer,
        bakerRecipes: bakerRecipeReducer,
        deliveryOrders: deliveryOrderReducer,
        reviews: reviewReducer,
        adminReviews: adminReviewReducer,
        wishlist: wishlistReducer,
        flashSale: flashSaleReducer,
    },
});

export default store;
