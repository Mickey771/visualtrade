import React, { useState, useEffect } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/reducers";
import axios from "axios";
import { fetchProfileDetails, setUser } from "@/redux/reducers/userReducer";
import { AppDispatch } from "@/redux/store";

const PlaceTrade: React.FC<{
  fetchTransactions: (page: number) => Promise<void>;
  currentPage: number;
}> = ({ fetchTransactions, currentPage }) => {
  // State management
  const [activeTab, setActiveTab] = useState("open");
  const [quantity, setQuantity] = useState(50000);
  const [margin, setMargin] = useState(257);
  const [leverage, setLeverage] = useState(200);
  const [change, setChange] = useState(-0.3);
  const [isHoveringBuy, setIsHoveringBuy] = useState(false);
  const [isHoveringSell, setIsHoveringSell] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [limitPrice, setLimitPrice] = useState("");

  // Get data from Redux store
  const { trade, user } = useSelector((store: RootState) => store);
  const { selectedFeed, selectedPair, isLoading, selectedPairPrice } = trade;
  const {
    user: { balance, access, credit },
  } = user;

  const dispatch = useDispatch<AppDispatch>();

  // Handle quantity changes with balance validation
  const increaseQuantity = () => {
    let newQuantity;
    if (quantity >= balance + credit) {
      newQuantity = balance + credit;
    } else {
      newQuantity = quantity + balance / 100;
    }
    // Calculate new margin to check against balance
    const newMargin = Math.round((newQuantity / leverage) * 0.01);

    // Only allow increase if user has sufficient balance
    if (newMargin <= balance) {
      setQuantity(newQuantity);
      updateMarginFromQuantity(newQuantity);
    } else {
      setErrorMessage("Insufficient balance for this trade size");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > balance / 100) {
      const newQuantity = quantity - balance / 100;
      setQuantity(newQuantity);
      updateMarginFromQuantity(newQuantity);
    }
  };

  // Helper function to update margin based on quantity and leverage
  const updateMarginFromQuantity = (qty: number) => {
    const newMargin = Math.round((qty / leverage) * 0.01);
    setMargin(newMargin);
  };

  // Tab switching
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setErrorMessage("");
    setSuccessMessage("");
  };

  // Submit trade function
  const submitTrade = async (action: "buy" | "sell") => {
    // Clear previous messages
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      // Format pair name for API
      const pairName =
        selectedFeed !== "commodity"
          ? selectedPair
          : selectedPair.replace("/", "");

      // Determine price based on action and tab
      let price;
      if (activeTab === "open") {
        price =
          action === "buy" ? selectedPairPrice.bid : selectedPairPrice.ask;
      } else {
        // For limit orders, use the manually entered price
        if (!limitPrice) {
          throw new Error("Please enter a limit price");
        }
        price = limitPrice;
      }

      const tradeData = {
        meta_data: {
          pair: pairName,
          leverage: leverage,
          margin: margin,
          order_type: activeTab === "open" ? "market" : "limit",
          boughtAt: price.toString(),
        },
        price: quantity,
      };

      // Use the Next.js API route to proxy the request
      const endpoint = `/api/trade/${action}`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tradeData),
      });

      const data = await response.json();

      console.log("response", response);

      if (!response.ok) {
        throw new Error(data.message || `Failed to ${action} trade`);
      }

      // Display success message
      setSuccessMessage(
        `${action.toUpperCase()} order submitted successfully!`
      );

      //   update user balance
      // dispatch(
      //   setUser({ ...user.user, balance: user.user.balance - quantity })
      // );
      dispatch(fetchProfileDetails());

      fetchTransactions(currentPage);

      // Optionally reset form or refresh data
      if (activeTab === "limit") {
        setLimitPrice("");
      }
    } catch (error) {
      // Handle and display errors
      setErrorMessage(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const buyPrice = selectedPairPrice?.bid || "Loading...";
  const sellPrice = selectedPairPrice?.ask || "Loading...";

  if (!selectedPair) {
    return (
      <div className="w-full lg:w-96 pb-10 lg:pb-0 bg-primaryBlue text-white p-10 text-2xl overflow-hidden">
        No pair selected
      </div>
    );
  }

  return (
    <div className="w-full lg:w-96 pb-10 lg:pb-0 bg-primaryBlue overflow-hidden">
      <div className="flex">
        <h2
          className={`text-center w-full py-3 border-b text-lg cursor-pointer ${
            activeTab === "open"
              ? "text-blue-500 border-blue-500"
              : "text-gray-300 font-light"
          }`}
          onClick={() => handleTabChange("open")}
        >
          OPEN DEAL
        </h2>
        <h2
          className={`text-center w-full py-3 border-b text-lg cursor-pointer ${
            activeTab === "limit"
              ? "text-blue-500 border-blue-500"
              : "text-gray-300 font-light"
          }`}
          onClick={() => handleTabChange("limit")}
        >
          LIMIT ORDER
        </h2>
      </div>

      <div className="flex flex-col px-5 mt-5">
        <div className="flex justify-between items-center pb-6 border-b border-gray-700">
          <h2 className="text-2xl text-white font-semibold">
            {/* {selectedFeed !== "commodity"
              ? `${selectedPair.slice(0, 3)}/${selectedPair.slice(3)}`
              : selectedPair} */}
            {selectedPair}
          </h2>
          {/* <p className="text-blue-500 text-lg">{selectedFeed}</p> */}
        </div>

        {/* Balance display */}
        <div className="flex justify-between items-center mt-3">
          <p className="text-gray-400">BALANCE:</p>
          <p className="text-white font-semibold">
            ${balance?.toFixed(2) || 0}
          </p>
        </div>

        <div className="flex justify-between items-center mt-3">
          <p className="text-gray-400">LEVERAGE:</p>
          <div className="flex items-center">
            <span className="text-white font-semibold mr-1">1:200</span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-3">
          <p className="text-gray-400">CHANGE:</p>
          <div className="flex items-center">
            <span className="text-green-500 font-semibold mr-1">1.5%</span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-3">
          <p className="text-gray-400">MARGIN:</p>
          <div className="flex items-center">
            <span className="text-green-500 font-semibold mr-1">$200</span>
          </div>
        </div>

        <div className="flex gap-3 border border-blue-500 rounded-lg px-3 py-2 text-white mt-5 w-full justify-between items-center">
          <button
            className="p-1 rounded-full hover:bg-blue-800 transition-colors duration-200 focus:outline-none"
            onClick={decreaseQuantity}
          >
            <FaMinus size={24} />
          </button>
          <div className="flex flex-col items-center gap-1">
            {/* <h1 className="text-2xl">{quantity.toLocaleString()}</h1> */}
            <input
              className="text-2xl bg-transparent text-center focus:outline-none w-full"
              type="number"
              name="quantity"
              value={quantity.toFixed(2)}
              onChange={(e) => {
                if (parseInt(e.target.value) > balance) {
                  setQuantity(balance + credit);
                  return;
                }
                setQuantity(parseInt(e.target.value));
              }}
            />
            <p className="text-sm">USD</p>
          </div>
          <button
            className="p-1 rounded-full hover:bg-blue-800 transition-colors duration-200 focus:outline-none"
            onClick={increaseQuantity}
          >
            <FaPlus size={24} />
          </button>
        </div>

        {/* Error and success messages */}
        {errorMessage && (
          <div className="bg-red-900/30 border border-red-500 text-red-500 rounded p-2 mt-4">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-900/30 border border-green-500 text-green-500 rounded p-2 mt-4">
            {successMessage}
          </div>
        )}

        <button
          disabled={isLoading || isSubmitting || margin > balance}
          className="w-full flex justify-between mt-8 px-3 py-2 bg-blue-500 shadow-lg disabled:opacity-70 rounded-md hover:bg-blue-600 active:bg-blue-700 transition-colors duration-200"
          onMouseEnter={() => setIsHoveringBuy(true)}
          onMouseLeave={() => setIsHoveringBuy(false)}
          onClick={() => submitTrade("buy")}
        >
          <p className="font-bold text-white">
            {isSubmitting && activeTab === "open" ? "SUBMITTING..." : "BUY"}
          </p>
          <p className="text-white">{buyPrice}</p>
        </button>

        <button
          disabled={isLoading || isSubmitting || margin > balance}
          className="w-full flex justify-between mt-6 px-3 py-2 bg-blue-500 shadow-lg disabled:opacity-70 rounded-md hover:bg-blue-600 active:bg-blue-700 transition-colors duration-200"
          onMouseEnter={() => setIsHoveringSell(true)}
          onMouseLeave={() => setIsHoveringSell(false)}
          onClick={() => submitTrade("sell")}
        >
          <p className="font-bold text-white">
            {isSubmitting && activeTab === "open" ? "SUBMITTING..." : "SELL"}
          </p>
          <p className="text-white">{sellPrice}</p>
        </button>

        {activeTab === "limit" && (
          <div className="mt-6 p-4 bg-gray-800 rounded-md">
            <p className="text-white mb-2">Set Limit Price:</p>
            <input
              type="number"
              className="w-full p-2 bg-gray-700 text-white rounded-md"
              placeholder="Enter price..."
              step="0.0001"
              min="0"
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceTrade;
