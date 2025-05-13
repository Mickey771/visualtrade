import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/reducers";
import { wsClient } from "@/utils/websocket";
import {
  setPriceUpdated,
  setSelectedPairPrice,
  setTransactions,
} from "@/redux/reducers/tradeReducer";
import {
  fetchProfileDetails,
  setBalance,
  setCredit,
} from "@/redux/reducers/userReducer";
import { AppDispatch } from "@/redux/store";

// Type definitions
interface PriceData {
  [pair: string]: {
    bid: number;
    ask: number;
    lastUpdate: string;
  };
}

// Function to close a transaction automatically
const closeTradeAutomatically = async (
  transaction: Transaction,
  currentPrice: number,
  profitLoss: number,
  profitLossPercentage: number
) => {
  try {
    // Format trade data to match your API expectations
    const tradeData = {
      meta_data: {
        closedAt: currentPrice.toString(),
        profitLoss: profitLoss,
        profitLossPercentage: profitLossPercentage,
        openPrice: transaction.meta_data.boughtAt,
      },
      id: transaction.id,
    };

    console.log("Auto-closing trade with data:", tradeData);

    // Use the same endpoint as the ClosePositionModal
    const response = await fetch("/api/trade/close", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tradeData),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `Failed to close trade automatically`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error closing transaction automatically:", error);
    return null;
  }
};

export const useRealTimePLCalculator = (transactions: Transaction[]) => {
  const [priceData, setPriceData] = useState<PriceData>({});
  const [plData, setPLData] = useState<{
    [id: string]: { amount: number; percentage: number };
  }>({});
  const [wsConnected, setWsConnected] = useState(false);
  const [processingLiquidation, setProcessingLiquidation] = useState<{
    [id: string]: boolean;
  }>({});

  const { selectedFeed, selectedPair, isLoading } = useSelector(
    (store: RootState) => store.trade
  );

  const {
    user: { balance, credit },
  } = useSelector((store: RootState) => store.user);

  const dispatch = useDispatch<AppDispatch>();

  // Helper function to check if a transaction has profit/loss data
  const hasNonZeroProfitLossData = (transaction: Transaction) => {
    if (transaction.closed) return true; // Closed transactions always use stored values

    // Check if transaction has non-zero profit/loss values in the data
    const hasProfitLossData =
      transaction.meta_data.profitLoss !== undefined &&
      transaction.meta_data.profitLoss !== 0;

    const hasProfitLossPercentageData =
      transaction.meta_data.profitLossPercentage !== undefined &&
      transaction.meta_data.profitLossPercentage !== 0;

    // If either profit/loss value exists and is non-zero, it has data
    return hasProfitLossData || hasProfitLossPercentageData;
  };

  useEffect(() => {
    // Only set up WebSocket if there are transactions that need real-time updates
    const openTransactionsNeedingUpdates = transactions.filter(
      (t) => !t.closed && !hasNonZeroProfitLossData(t)
    );

    if (openTransactionsNeedingUpdates.length === 0) {
      // No transactions need real-time updates, so set wsConnected to true to hide the connecting message
      setWsConnected(true);
      return; // No need to connect if there are no transactions needing updates
    }

    // Connect to WebSocket for real-time price updates
    const wsUrl = `wss://quote.tradeswitcher.com/quote-b-ws-api?token=${process.env.NEXT_PUBLIC_ALL_TICK_API_KEY}`;

    wsClient.setHeartbeatCallback(() => {
      const heartbeat = {
        cmd_id: 22000,
        seq_id: 123,
        trace: `pl-calculator-heartbeat`,
        data: {},
      };
      wsClient.sendMessage(JSON.stringify(heartbeat));
    });

    wsClient.connect(wsUrl);

    const ws = wsClient.ws;

    if (ws) {
      ws.addEventListener("open", () => {
        setWsConnected(true);

        // Subscribe to all pairs from open transactions that don't have stored P/L data
        const openTransactions = transactions.filter(
          (t) => !t.closed && !hasNonZeroProfitLossData(t)
        );

        const tradingPairs = openTransactions.map((t) => {
          // Format pairs according to feed type (crypto has '/' in pair name)
          return selectedFeed === "crypto"
            ? t.meta_data.pair.replace("/", "")
            : t.meta_data.pair;
        });

        // Remove duplicates
        const uniquePairs = [...new Set(tradingPairs)];

        if (uniquePairs.length > 0) {
          const subscribeMsg = {
            cmd_id: 22002,
            seq_id: 123,
            trace: `pl-calculator-subscription`,
            data: {
              symbol_list: uniquePairs.map((pair) => ({
                code: pair,
                depth_level: 1,
              })),
            },
          };
          wsClient.sendMessage(JSON.stringify(subscribeMsg));
        }
      });

      ws.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);

        if (data.cmd_id === 22999) {
          const pairCode = data.data.code;

          // Update price data
          setPriceData((prev) => ({
            ...prev,
            [pairCode]: {
              bid: parseFloat(data.data?.bids?.[0]?.price || "0"),
              ask: parseFloat(data.data?.asks?.[0]?.price || "0"),
              lastUpdate: data.data.tick_time,
            },
          }));

          if (data.data.code === selectedPair.split("/").join("")) {
            const selectedPairBid = data.data?.bids?.[0]?.price || "0";
            const selectedPairAsk = data.data?.asks?.[0]?.price || "0";
            const bid = parseFloat(selectedPairBid);
            const ask = parseFloat(selectedPairAsk);
            dispatch(setSelectedPairPrice({ bid, ask }));
            dispatch(setPriceUpdated(true));
          }
        }
      });

      return () => {
        ws.close();
        wsClient.disconnect();
      };
    }
  }, [transactions, selectedFeed]);

  // Calculate P/L for all truly live positions whenever price data updates
  useEffect(() => {
    if (Object.keys(priceData).length > 0) {
      const newPLData: {
        [id: string]: { amount: number; percentage: number };
      } = {};

      const transactionsToLiquidate: Transaction[] = [];
      const userTotalFunds = balance + credit;

      transactions.forEach((transaction) => {
        // Calculate for all open transactions
        if (!transaction.closed && !hasNonZeroProfitLossData(transaction)) {
          const pairCode =
            selectedFeed === "crypto"
              ? transaction.meta_data.pair.replace("/", "")
              : transaction.meta_data.pair;

          const currentPrice = priceData[pairCode];

          if (currentPrice) {
            // Extract necessary values for P/L calculation
            const openPrice = parseFloat(transaction.meta_data.boughtAt);
            const tradeSize = transaction.price;
            const leverage = parseFloat(transaction.meta_data.leverage || "1");
            const margin = transaction.meta_data.margin
              ? parseFloat(transaction.meta_data.margin)
              : tradeSize / leverage;

            // For calculating quantity
            const quantity = transaction.meta_data.quantity
              ? transaction.meta_data.quantity
              : tradeSize;

            // Calculate price difference based on position type (BUY or SELL)
            let priceDiff = 0;

            if (transaction.type === "BUY") {
              // For long positions: current - open
              priceDiff = currentPrice.bid - openPrice;
            } else {
              // For short positions: open - current
              priceDiff = openPrice - currentPrice.ask;
            }

            // Calculate P/L amount and percentage
            const pnlAmount = (priceDiff / openPrice) * quantity * leverage;
            const pnlPercentage = (pnlAmount / margin) * 100;

            newPLData[transaction.id] = {
              amount: pnlAmount,
              percentage: pnlPercentage,
            };

            // Check if the loss equals or exceeds the user's total funds (balance + credit)
            // Only check for losses (negative P/L) and avoid duplicate processing
            if (
              pnlAmount <= -userTotalFunds &&
              pnlAmount < 0 &&
              !processingLiquidation[transaction.id]
            ) {
              transactionsToLiquidate.push(transaction);
            }
          }
        }
      });

      setPLData(newPLData);

      // Process liquidations if needed
      if (transactionsToLiquidate.length > 0) {
        // Process each transaction that needs to be liquidated
        transactionsToLiquidate.forEach(async (transaction) => {
          // Mark as processing to prevent duplicate liquidations
          setProcessingLiquidation((prev) => ({
            ...prev,
            [transaction.id]: true,
          }));

          try {
            // Get the current price for this transaction's pair
            const pairCode =
              selectedFeed === "crypto"
                ? transaction.meta_data.pair.replace("/", "")
                : transaction.meta_data.pair;

            const currentPriceData = priceData[pairCode];
            if (!currentPriceData) {
              console.error(`No price data available for ${pairCode}`);
              return;
            }

            // Use bid for SELL positions and ask for BUY positions (inverse of opening)
            const currentPrice =
              transaction.type === "BUY"
                ? currentPriceData.bid
                : currentPriceData.ask;

            // The loss equals the user's total funds (balance + credit)
            const exactLoss = -userTotalFunds;

            // Calculate percentage loss (always -100% in this case)
            const tradeSize = transaction.price;
            const leverage = parseFloat(transaction.meta_data.leverage || "1");
            const margin = transaction.meta_data.margin
              ? parseFloat(transaction.meta_data.margin)
              : tradeSize / leverage;
            const percentageLoss = (exactLoss / margin) * 100;

            // Call the API to close the position
            const result = await closeTradeAutomatically(
              transaction,
              currentPrice,
              exactLoss,
              percentageLoss
            );

            if (result) {
              // Update the transaction list - mark as closed
              const updatedTransactions = transactions.map((t) => {
                if (t.id === transaction.id) {
                  return {
                    ...t,
                    closed: true,
                    meta_data: {
                      ...t.meta_data,
                      closedAt: currentPrice.toString(),
                      profitLoss: exactLoss, // Loss equals user's total funds
                      profitLossPercentage: percentageLoss, // 100% loss
                    },
                  };
                }
                return t;
              });

              // Update redux state
              dispatch(setTransactions(updatedTransactions));

              // Set balance to zero and credit to negative
              dispatch(setBalance(0));
              dispatch(setCredit(-credit));

              // Fetch updated profile details to ensure all state is in sync
              dispatch(fetchProfileDetails());

              console.log(
                `Transaction ${transaction.id} auto-closed due to insufficient funds`
              );
            }
          } catch (error) {
            console.error(
              `Failed to auto-close transaction ${transaction.id}:`,
              error
            );
          } finally {
            // Reset processing state regardless of outcome
            setProcessingLiquidation((prev) => ({
              ...prev,
              [transaction.id]: false,
            }));
          }
        });
      }
    }
  }, [priceData, transactions, selectedFeed, balance, credit, dispatch]);

  // Format P/L with color coding
  const formatPL = (amount: number) => {
    const formattedValue = amount.toFixed(2);
    const isPositive = amount >= 0;

    return (
      <span className={isPositive ? "text-green-500" : "text-red-500"}>
        {isPositive ? "+" : ""}
        {formattedValue}
      </span>
    );
  };

  // Format P/L percentage with color coding
  const formatPLPercentage = (percentage: number) => {
    const formattedValue = percentage.toFixed(2);
    const isPositive = percentage >= 0;

    return (
      <span className={isPositive ? "text-green-500" : "text-red-500"}>
        {isPositive ? "+" : ""}
        {formattedValue}%
      </span>
    );
  };

  return {
    plData,
    wsConnected,
    formatPL,
    formatPLPercentage,
  };
};
