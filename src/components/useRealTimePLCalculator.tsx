import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/reducers";
import { wsClient } from "@/utils/websocket";
import {
  setPriceUpdated,
  setSelectedPairPrice,
} from "@/redux/reducers/tradeReducer";

// Type definitions

interface PriceData {
  [pair: string]: {
    bid: number;
    ask: number;
    lastUpdate: string;
  };
}

export const useRealTimePLCalculator = (transactions: Transaction[]) => {
  const [priceData, setPriceData] = useState<PriceData>({});
  const [plData, setPLData] = useState<{
    [id: string]: { amount: number; percentage: number };
  }>({});
  const [wsConnected, setWsConnected] = useState(false);

  // const { selectedFeed } = useSelector((store: RootState) => store.trade);
  const { selectedFeed, selectedPair, isLoading } = useSelector(
    (store: RootState) => store.trade
  );

  const dispatch = useDispatch();

  useEffect(() => {
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

        // Subscribe to all pairs from active transactions
        const tradingPairs = transactions
          .filter((t) => !t.closed)
          .map((t) => {
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

  // Calculate P/L for all open positions whenever price data updates
  useEffect(() => {
    if (Object.keys(priceData).length > 0) {
      const newPLData: {
        [id: string]: { amount: number; percentage: number };
      } = {};

      transactions.forEach((transaction) => {
        if (!transaction.closed) {
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
          }
        }
      });

      setPLData(newPLData);
    }
  }, [priceData, transactions, selectedFeed]);

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
