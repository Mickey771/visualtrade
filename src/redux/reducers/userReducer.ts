// reducers/exampleReducer.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState: InitialState = {
  isAuth: false,
  user: {
    access: "",
    email: "",
    id: "",
    full_name: "",
    date_joined: "",
    balance: 0.0,
    equity: 0.0,
    margin: 0.0,
    free_margin: 0.0,
    open_p_and_l: 0.0,
    close_p_and_l: 0.0,
    credit: 0.0,
  },
};

export const refreshToken = createAsyncThunk(
  "user/refresh",
  async (refresh, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/v1/refresh/`,
        refresh
      );
      if (response.status === 201) {
        return response.data;
      } else {
        throw new Error();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("There was an error: ", error.response?.data?.message);
        return rejectWithValue(error.response?.data || "Something went wrong");
      } else {
        console.log("There was an unexpected error: ", error);
        return rejectWithValue({ error: "Unknown error" });
      }
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<boolean>) => {
      state.isAuth = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuth = false;
      state.user = {
        access: "",
        email: "",
        id: "",
        full_name: "",
        date_joined: "",
        balance: 0.0,
        equity: 0.0,
        margin: 0.0,
        free_margin: 0.0,
        open_p_and_l: 0.0,
        close_p_and_l: 0.0,
        credit: 0.0,
      };
    },
  },
});

export const { setAuth, setUser, logout } = userSlice.actions;
export default userSlice.reducer;
