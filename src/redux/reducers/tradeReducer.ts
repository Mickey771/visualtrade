import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

interface InitialState {
  selectedFeed: "forex" | "crypto" | "commodity" | "stocks";
  selectedPair: string;
  isLoading: boolean;
  selectedPairPrice: {
    bid: number;
    ask: number;
  };
}

const initialState: InitialState = {
  selectedFeed: "forex",
  selectedPair: "",
  isLoading: false,
  selectedPairPrice: {
    bid: 0,
    ask: 0,
  },
};

const tradeSlice = createSlice({
  name: "trade",
  initialState,
  reducers: {
    setSelectedFeed: (state, action) => {
      state.selectedFeed = action.payload;
    },
    setSelectedPair: (state, action) => {
      state.selectedPair = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setSelectedPairPrice: (state, action) => {
      state.selectedPairPrice = action.payload;
    },
  },
});

export const {
  setSelectedFeed,
  setSelectedPair,
  setIsLoading,
  setSelectedPairPrice,
} = tradeSlice.actions;
export default tradeSlice.reducer;
