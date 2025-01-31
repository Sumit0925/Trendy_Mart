import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
};

const API = import.meta.env.VITE_APP_URI_API;

export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async () => {
    // console.log(fetchAllFilteredProducts, "fetchAllFilteredProducts");

    // const query = new URLSearchParams({
    //   ...filterParams,
    //   sortBy: sortParams,
    // });

    const result = await axios.get(`${API}/api/shop/products/get`);

    // console.log(result); 

    return result?.data;
  }
);

// export const fetchProductDetails = createAsyncThunk(
//     "/products/fetchProductDetails",
//     async (id) => {
//       const result = await axios.get(
//         `http://localhost:5000/api/shop/products/get/${id}`
//       );

//       return result?.data;
//     }
//   );

const shoppingProductsSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        // console.log(action.payload)
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
      });
  },
});

// export const { setProductDetails } = shoppingProductSlice.actions;

export default shoppingProductsSlice.reducer;
