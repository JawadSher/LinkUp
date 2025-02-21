import { createSlice } from "@reduxjs/toolkit";

const getScreenType = (width) => {
  if (width <= 640) return "mobile";
  if (width <= 1024) return "tablet";
  if (width <= 1440) return "laptop";
  return "desktop";
};

const initialState = {
    screenType : getScreenType(window.innerWidth)
}

const screenSlice = createSlice({
    name: "screen",
    initialState,
    reducers: {
        setScreenType: (state, action) => {
            state.screenType = action.payload
        }
    }
})

export const {setScreenType} = screenSlice.actions;
export default screenSlice.reducer;