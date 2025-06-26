import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import EditProductPage from "./components/Admin/EditProductPage";
import EditIngredientPage from "./components/Admin/EditIngredientPage";
import OderManagement from "./components/Admin/OrderManagement";
import AnalyticsPage from "./components/Admin/AnalyticsPage";
import GoogleCallback from "./components/Auth/GoogleCallback";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import ZaloPayManualReturn from "./pages/ZaloPayManualReturn";
import PaymentReturnHelper from "./pages/PaymentReturnHelper";
import ZaloPayInstructions from "./pages/ZaloPayInstructions";
import SearchResultsPage from "./pages/SearchResultsPage";

import { Provider } from "react-redux";
import store from "./redux/store"; // Assuming you have a Redux store set up
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Provider store={store}>
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
            <Route path="orders" element={<OderManagement />} />
            <Route path="analytics" element={<AnalyticsPage />} />
          </Route>
          {/*  */}
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
