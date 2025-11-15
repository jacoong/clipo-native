import { createSlice } from "@reduxjs/toolkit";

const faviconSlice = createSlice({
  name: "favicon",
  initialState: {
   ids:[]
  },
  reducers: {
    addFavorite: (state, action) => {
    },
    removeFavorite: (state, action) => {
    }
    }});

export const addFavorite = faviconSlice.actions.addFavorite;
export const removeFavorite = faviconSlice.actions.removeFavorite;

export default faviconSlice.reducer;