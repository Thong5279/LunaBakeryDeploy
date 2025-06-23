import { createSlice ,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//helper function to load cart from localStorage
const loadCartFromLocalStorage = () => {
  const  storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : { product:[] };
};

//Helper function to save cart to localStorage
const saveCartToLocalStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};
//Fetch cart for a user or guest 
export const fetchCart = createAsyncThunk("cart/fetchCart",async ({userId , guestId}, {rejectWithValue}) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
            {
                params: {
                    userId,
                    guestId
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching cart:", error);
        return rejectWithValue(error.response.data);
    }   
  }
);

//And an item to the cart for a user or guest
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity, userId, guestId , size, flavor}, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        { productId, quantity, size, flavor , userId, guestId }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding to cart:", error);
      return rejectWithValue(error.response.data);
    }
  }
); 

//Update the quantity of an item in the cart
export const updateCartItemQuantity = createAsyncThunk(
    "cart/updateCartItemQuantity",
    async ({ productId,size,flavor, quantity, userId, guestId }, { rejectWithValue }) => {
        try {
        const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
            { productId,quantity, userId, guestId , size, flavor } // Include size and flavor if needed
        );
        return response.data;
        } catch (error) {
        console.error("Error updating cart item quantity:", error);
        return rejectWithValue(error.response?.data);
        }
    }
);
//remove an item from the cart
export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async ({ productId, size, flavor, userId, guestId }, { rejectWithValue }) => {
      try {
        const response = await axios({
          method: "DELETE",
          url: `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
          data: { userId, guestId, productId, size, flavor },
        });
        return response.data;
      } catch (error) {
        console.error("Error removing from cart:", error);
        return rejectWithValue(error.response.data);
      }
    }
  );

//Merge the cart for a user and guest
export const mergeCart = createAsyncThunk("cart/mergeCart", async ({ userId, guestId }, { rejectWithValue }) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,
            { userId, guestId },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error merging cart:", error);
        return rejectWithValue(error.response.data);
    }
});

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cart: loadCartFromLocalStorage(),
        loading: false,
        error: null,
    },
    reducers: {
        // Reducer to clear the cart
        clearCart: (state) => {
            state.cart = { product: [] };
            localStorage.removeItem("cart");
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchCart.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchCart.fulfilled, (state, action) => {
            state.cart = action.payload;
            state.loading = false;
            saveCartToLocalStorage(action.payload);
        })
        .addCase(fetchCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message || "Failed to fetch cart";
        })
        //
        .addCase(addToCart.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addToCart.fulfilled, (state, action) => {
            state.cart = action.payload;
            state.loading = false;
            saveCartToLocalStorage(action.payload);
        })
        .addCase(addToCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to add to cart";
        })
        //
        .addCase(removeFromCart.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(removeFromCart.fulfilled, (state, action) => {
            state.cart = action.payload;
            state.loading = false;
            saveCartToLocalStorage(action.payload);
        })
        .addCase(removeFromCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to remove from cart";
        })
        //
        .addCase(mergeCart.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(mergeCart.fulfilled, (state, action) => {
            state.cart = action.payload;
            state.loading = false;
            saveCartToLocalStorage(action.payload);
        })
        .addCase(mergeCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to merge cart";
        })
        // 👇 THÊM phần này vào extraReducers
.addCase(updateCartItemQuantity.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
    state.cart = action.payload;
    state.loading = false;
    saveCartToLocalStorage(action.payload);
  })
  .addCase(updateCartItemQuantity.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload?.message || "Failed to update cart item";
  })
  

    }
})

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
