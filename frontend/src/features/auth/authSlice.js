import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/api';

export const fetchUser = createAsyncThunk("auth/fetchUser", async (_, thunkAPI) => {
    try{
        const response = await API.get("/user/auth/current-user");
        thunkAPI.dispatch(setUser(response.data))
        return response.data;
    } catch (error){
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to get current user")
    }
});

export const login = createAsyncThunk("auth/login", async ({email, password}, thunkAPI) => {
    try{
        const response = await API.post("/user/auth/login", {email, password});

        return response.data;
    }catch(error){
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Login failed")
    }
});

export const signup = createAsyncThunk("auth/signup", async ({firstName, lastName, email, channelName, password}, thunkAPI) => {
    try{
        const response = await API.post("/user/auth/register", {firstName, lastName, email, channelName, password});

        return response.data;
    } catch (error){
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Registration Failed")
    }
})

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
    try{
        await API.post("/user/auth/logout");
        API.interceptors.response.handlers = [];
        localStorage.clear();
        return null;
    } catch(error){
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Logout failed")
    }
});

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        error: null,
        loading: false
    },

    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => { state.loading = true; })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.user = null;
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload;
                state.error = null; 
            })
            .addCase(login.rejected, (state, action) => {
                state.user = null;
                state.error = action.payload
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.user = action.payload;
                state.error = null;
            })
            .addCase(signup.rejected, (state, action) => {
                state.user = null;
                state.error = action.payload;
            });
    }
});

export const {setUser} = authSlice.actions;
export default authSlice.reducer;