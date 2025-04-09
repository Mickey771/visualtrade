import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

interface InitialState {
  selectedFeed: "forex" | "crypto" | "commodity" | "stocks";
  selectedPair: string;
  isLoading: boolean;
  priceUpdated: boolean;
  selectedPairPrice: {
    bid: number;
    ask: number;
  };
  selectedTransaction: Transaction | null;
  transactions: Transaction[];
}

const initialState: InitialState = {
  selectedFeed: "forex",
  selectedPair: "",
  isLoading: false,
  priceUpdated: false,
  selectedPairPrice: {
    bid: 0,
    ask: 0,
  },
  selectedTransaction: null,
  transactions: [],
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
    setSelectedTransaction: (state, action) => {
      state.selectedTransaction = action.payload;
    },
    setTransactions: (state, action) => {
      state.transactions = action.payload;
    },
    setPriceUpdated: (state, action) => {
      state.priceUpdated = action.payload;
    },
  },
});

export const {
  setSelectedFeed,
  setSelectedPair,
  setIsLoading,
  setSelectedPairPrice,
  setSelectedTransaction,
  setTransactions,
  setPriceUpdated,
} = tradeSlice.actions;
export default tradeSlice.reducer;
