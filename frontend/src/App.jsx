import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "./redux/slices/authSlice";
import UserLayout from "./components/Layout/UserLayout";
import Home from "./pages/Home";
import { Toaster } from "sonner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CollectionPage from "./pages/CollectionPage";
import IngredientsPage from "./pages/IngredientsPage";
import ProductDetails from "./components/Products/ProductDetails";
import IngredientDetails from "./components/Products/IngredientDetails";
import Checkout from "./components/Cart/Checkout";
import OderconfirmationPage from "./pages/OderconfirmationPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminHomePage from "./pages/AdminHomePage";
import UserManagement from "./components/Admin/UserManagement";
import ProductManagement from "./components/Admin/ProductManagement";
import IngredientManagement from "./components/Admin/IngredientManagement";
import InventoryManagement from "./components/Admin/InventoryManagement";
import EditProductPage from "./components/Admin/EditProductPage";
import EditIngredientPage from "./components/Admin/EditIngredientPage";
import OrderManagement from "./components/Admin/OrderManagement";
import RecipeManagement from "./components/Admin/RecipeManagement";
import AnalyticsPage from "./components/Admin/AnalyticsPage";
import ReviewManagement from "./components/Admin/ReviewManagement";
import FlashSaleManagement from "./components/Admin/FlashSaleManagement";
import ManagerLayout from "./components/Manager/ManagerLayout";
import ManagerHomePage from "./pages/ManagerHomePage";
import ManagerOrderManagement from "./components/Manager/ManagerOrderManagement";
import BakerLayout from "./components/Baker/BakerLayout";
import BakerHomePage from "./pages/BakerHomePage";
import BakerOrderManagement from "./components/Baker/BakerOrderManagement";
import BakerRecipeManagement from "./components/Baker/BakerRecipeManagement";
import DeliveryLayout from "./components/Delivery/DeliveryLayout";
import DeliveryHomePage from "./pages/DeliveryHomePage";
import DeliveryOrderManagement from "./components/Delivery/DeliveryOrderManagement";
import GoogleCallback from "./components/Auth/GoogleCallback";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import ZaloPayManualReturn from "./pages/ZaloPayManualReturn";
import PaymentReturnHelper from "./pages/PaymentReturnHelper";
import ZaloPayInstructions from "./pages/ZaloPayInstructions";
import SearchResultsPage from "./pages/SearchResultsPage";
import Contact from "./pages/Contact";
import About from "./pages/About";
import WishlistPage from "./pages/WishlistPage";

import { Provider } from "react-redux";
import store from "./redux/store"; // Assuming you have a Redux store set up
import ProtectedRoute from "./components/ProtectedRoute";

const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Khôi phục user từ localStorage khi app khởi động
    const userInfo = localStorage.getItem('userInfo');
    const userToken = localStorage.getItem('userToken');
    
    if (userInfo && userToken) {
      try {
        const user = JSON.parse(userInfo);
        dispatch(setUser(user));
        console.log('✅ User restored from localStorage:', user.name);
      } catch (error) {
        console.error('❌ Error parsing user from localStorage:', error);
        localStorage.removeItem('userInfo');
        localStorage.removeItem('userToken');
      }
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<GoogleCallback />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/collections/:collection"
            element={<CollectionPage />}
          />
          <Route path="/ingredients" element={<IngredientsPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="ingredient/:id" element={<IngredientDetails />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="zalopay-return" element={<ZaloPayManualReturn />} />
          <Route path="zalopay-instructions" element={<ZaloPayInstructions />} />
          <Route path="payment-helper" element={<PaymentReturnHelper />} />
          <Route
            path="orders-confirmation"
            element={<OderconfirmationPage />}
          />
          <Route path="order/:id" element={<OrderDetailsPage />} />
          <Route path="my-orders" element={<MyOrdersPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/wishlist" element={<WishlistPage />} />
        </Route>
        
        {/* admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminHomePage />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="products/:id/edit" element={<EditProductPage />} />
          <Route path="ingredients" element={<IngredientManagement />} />
          <Route path="ingredients/:id/edit" element={<EditIngredientPage />} />
          <Route path="recipes" element={<RecipeManagement />} />
          <Route path="inventory" element={<InventoryManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="reviews" element={<ReviewManagement />} />
          <Route path="flash-sales" element={<FlashSaleManagement />} />
        </Route>

        {/* manager */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute role="manager">
              <ManagerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ManagerHomePage />} />
          <Route path="orders" element={<ManagerOrderManagement />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="products/:id/edit" element={<EditProductPage />} />
          <Route path="ingredients" element={<IngredientManagement />} />
          <Route path="ingredients/:id/edit" element={<EditIngredientPage />} />
          <Route path="inventory" element={<InventoryManagement />} />
          <Route path="reviews" element={<ReviewManagement />} />
          <Route path="flash-sales" element={<FlashSaleManagement />} />
        </Route>

        {/* baker */}
        <Route
          path="/baker"
          element={
            <ProtectedRoute role="baker">
              <BakerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<BakerHomePage />} />
          <Route path="orders" element={<BakerOrderManagement />} />
          <Route path="recipes" element={<BakerRecipeManagement />} />
        </Route>

        {/* delivery */}
        <Route
          path="/delivery"
          element={
            <ProtectedRoute role="shipper">
              <DeliveryLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DeliveryHomePage />} />
          <Route path="orders" element={<DeliveryOrderManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
