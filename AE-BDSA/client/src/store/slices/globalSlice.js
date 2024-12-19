import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loggedIn: false,
    checkTokenLoading: true,
    token: null,
    user:null
}

export const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        setLoggedIn: (state, action) => {
            state.loggedIn = action.payload;
        },
        setCheckTokenLoading: (state, action) => {
            state.checkTokenLoading = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },setUser: (state, action) => {
            state.user = action.payload; // Salvează datele utilizatorului
          },
          clearUser: (state) => {
            state.user = null; // Curăță datele utilizatorului la logout
            state.loggedIn = false;
            state.token = null;
          }
    }
});
export const { setLoggedIn,setCheckTokenLoading, setToken, setUser, clearUser } = globalSlice.actions;
export default globalSlice.reducer;
//export const { setLoggedIn, setCheckTokenLoading, setToken } = globalSlice.actions;

//export default globalSlice.reducer;