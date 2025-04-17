import { useEffect, useState, useRef } from "react";
import { wsClient } from "@/utils/websocket";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/reducers";
import {
  setIsLoading,
  setSelectedPairPrice,
} from "@/redux/reducers/tradeReducer";
import { marketOptions } from "@/utils/data";

export function useMarketData() {
  const [marketData, setMarketData] = useState<Record<string, MarketData>>({});
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectingRef = useRef<boolean>(false);

  // Force the component to re-render when an error occurs or clears
  const [forceUpdate, setForceUpdate] = useState(0);

  const { selectedFeed, selectedPair, isLoading } = useSelector(
    (store: RootState) => store.trade
  );

  const pairs = selectedFeed && marketOptions[selectedFeed].pairs;

  const dispatch = useDispatch();

  // Clean up function for WebSocket connections and timers
  const cleanupWebSocketResources = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Listen for the reconnection event directly in the hook
  useEffect(() => {
    const handleReconnected = () => {
      console.log("Reconnection detected in hook, clearing error state");
      setError(null);
      setForceUpdate((prev) => prev + 1); // Force re-render
      dispatch(setIsLoading(false));
    };

    window.addEventListener("websocket_reconnected", handleReconnected);
    return () => {
      window.removeEventListener("websocket_reconnected", handleReconnected);
    };
  }, [dispatch]);

  useEffect(() => {
    const wsUrl = `wss://quote.tradeswitcher.com/quote-b-ws-api?token=${process.env.NEXT_PUBLIC_ALL_TICK_API_KEY}`;

    // Clear any existing heartbeat timer
    cleanupWebSocketResources();

    // Force error state to be cleared when the selectedFeed/selectedPair changes
    // This ensures the UI updates when we switch feeds or pairs
    setError(null);

    wsClient.setHeartbeatCallback(() => {
      // Clear any existing timer first
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      timerRef.current = setInterval(() => {
        // Only send heartbeat if the connection is open
        if (wsClient.ws && wsClient.ws.readyState === WebSocket.OPEN) {
          const heartbeat = {
            cmd_id: 22000,
            seq_id: 123,
            trace: `${selectedFeed}-heartbeat`,
            data: {},
          };
          wsClient.sendMessage(JSON.stringify(heartbeat));
        } else {
          console.log("Heartbeat skipped - connection not open");
        }
      }, 10000);
    });

    // Set up handlers before connecting
    const handleMessage = (event: MessageEvent) => {
      try {
        const data: MarketData = JSON.parse(event.data);

        if (data.cmd_id === 22999) {
          setMarketData((current) => ({
            ...current,
            [data.data.code]: data,
          }));

          if (data.data.code === selectedPair.split("/").join("")) {
            const selectedPairBid = data.data?.bids?.[0]?.price || "0";
            const selectedPairAsk = data.data?.asks?.[0]?.price || "0";
            const bid = parseFloat(selectedPairBid);
            const ask = parseFloat(selectedPairAsk);
            dispatch(setSelectedPairPrice({ bid, ask }));
          }
        }
      } catch (e) {
        console.error("Error parsing websocket message:", e);
      }
    };

    const handleError = (error: Event) => {
      setError("Connection error");
      dispatch(setIsLoading(false));
      reconnectingRef.current = true;
    };

    const handleOpen = () => {
      console.log("WebSocket opened - clearing error state");
      setError(null);
      dispatch(setIsLoading(false));
      reconnectingRef.current = false;

      // Send subscription message
      const subscribeMsg = {
        cmd_id: 22002,
        seq_id: 123,
        trace: `${selectedFeed}-subscription-001`,
        data: {
          symbol_list: pairs.map((pair) => ({
            code: selectedFeed === "crypto" ? pair.replace("/", "") : pair,
            depth_level: 1,
          })),
        },
      };
      wsClient.sendMessage(JSON.stringify(subscribeMsg));
    };

    const handleClose = () => {
      if (!reconnectingRef.current) {
        setError("Connection closed");
        dispatch(setIsLoading(true));
        reconnectingRef.current = true;
      }
    };

    // Connect to WebSocket
    wsClient.connect(wsUrl);

    const ws = wsClient.ws;
    if (ws) {
      ws.addEventListener("message", handleMessage);
      ws.addEventListener("error", handleError);
      ws.addEventListener("open", handleOpen);
      ws.addEventListener("close", handleClose);

      return () => {
        ws.removeEventListener("message", handleMessage);
        ws.removeEventListener("error", handleError);
        ws.removeEventListener("open", handleOpen);
        ws.removeEventListener("close", handleClose);

        cleanupWebSocketResources();

        // Don't disconnect if we're just switching feeds/pairs
        // This will be handled by the reconnection logic
      };
    }

    return () => {
      cleanupWebSocketResources();
    };
  }, [selectedFeed, selectedPair, pairs, dispatch]);

  // Effect to handle cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupWebSocketResources();
      wsClient.disconnect();
    };
  }, []);

  const reconnect = () => {
    if (error) {
      setError(null);
      dispatch(setIsLoading(true));
      wsClient.reconnect();
    }
  };

  return {
    pairs,
    marketData,
    isLoading,
    setIsLoading,
    error,
    setError,
    timerRef,
    dispatch,
    reconnect, // Added method to manually trigger reconnection
    forceUpdate, // Add this to force component re-renders
  };
}
