import React, { useEffect, useRef, memo, useState } from "react";
import { useSelector } from "react-redux";

function TradingViewWidget() {
  const [isLoading, setIsLoading] = useState(true);
  const { chartSymbol } = useSelector((store) => store.trade);

  const container = useRef(null);

  useEffect(() => {
    setIsLoading(true);

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;

    script.onload = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    script.onerror = () => {
      setIsLoading(false);
    };

    script.innerHTML = `
      {
        "autosize": true,
        "symbol": "${chartSymbol}",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "allow_symbol_change": true,
        "support_host": "https://www.tradingview.com"
      }`;

    if (container.current) {
      container.current.innerHTML = "";
      container.current.appendChild(script);
    }

    return () => {
      if (container.current && script.parentNode === container.current) {
        container.current.removeChild(script);
      }
    };
  }, [chartSymbol]);

  return (
  <div className="w-full relative h-full" style={{ minHeight: 0 }}>
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{
        width: "100%",
        height: "100%", // Always fill parent
      }}
    ></div>
    {isLoading && (
      <div className="absolute h-full inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <span className="text-white">Loading chart...</span>
      </div>
    )}
  </div>
);
}

export default memo(TradingViewWidget)