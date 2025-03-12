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

  const { selectedFeed, selectedPair, isLoading } = useSelector(
    (store: RootState) => store.trade
  );

  const pairs = selectedFeed && marketOptions[selectedFeed].pairs;

  const dispatch = useDispatch();

  useEffect(() => {
    const wsUrl = `wss://quote.tradeswitcher.com/quote-b-ws-api?token=${process.env.NEXT_PUBLIC_ALL_TICK_API_KEY}`;

    wsClient.setHeartbeatCallback(() => {
      timerRef.current = setInterval(() => {
        const heartbeat = {
          cmd_id: 22000,
          seq_id: 123,
          trace: `${selectedFeed}-heartbeat`,
          data: {},
        };
        wsClient.sendMessage(JSON.stringify(heartbeat));
      }, 10000);
    });

    wsClient.connect(wsUrl);

    const ws = wsClient.ws;
    if (ws) {
      const handleMessage = (event: MessageEvent) => {
        const data: MarketData = JSON.parse(event.data);

        if (data.cmd_id === 22999) {
          setMarketData((current) => ({
            ...current,
            [data.data.code]: data,
          }));

          // console.log("data", data);

          if (data.data.code === selectedPair) {
            const selectedPairBid = data.data?.bids?.[0]?.price || "0";
            const selectedPairAsk = data.data?.asks?.[0]?.price || "0";
            const bid = parseFloat(selectedPairBid);
            const ask = parseFloat(selectedPairAsk);
            dispatch(setSelectedPairPrice({ bid, ask }));
          }
        }
      };

      const handleError = (error: Event) => {
        setError("Connection error");
        dispatch(setIsLoading(false));
      };

      const handleOpen = () => {
        dispatch(setIsLoading(false));
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

      ws.addEventListener("message", handleMessage);
      ws.addEventListener("error", handleError);
      ws.addEventListener("open", handleOpen);

      return () => {
        ws.removeEventListener("message", handleMessage);
        ws.removeEventListener("error", handleError);
        ws.removeEventListener("open", handleOpen);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        wsClient.disconnect();
      };
    }
  }, [selectedFeed, selectedPair]);

  return {
    pairs,
    marketData,
    isLoading,
    setIsLoading,
    error,
    setError,
    timerRef,
    dispatch,
  };
}
