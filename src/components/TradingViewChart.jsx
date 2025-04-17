// TradingViewWidget.jsx
import React, { useEffect, useRef, memo, useState } from "react";
import { useSelector } from "react-redux";

function TradingViewWidget() {
  const [isLoading, setIsLoading] = useState(true);
  const { chartSymbol } = useSelector((store) => store.trade);

  const container = useRef();

  useEffect(() => {
    // Set loading to true when chart symbol changes
    setIsLoading(true);
    console.log("chartSymbol", chartSymbol);

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;

    // This event listener will be triggered when the script loads
    script.onload = () => {
      // We need a slight delay as TradingView might not be fully rendered yet
      setTimeout(() => {
        setIsLoading(false);
      }, 1000); // Adjust timeout as needed
    };

    // This handles loading failures
    script.onerror = () => {
      console.error("Failed to load TradingView widget");
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

    container.current.innerHTML = "";
    container.current.appendChild(script);

    return () => {
      if (container.current && script.parentNode === container.current) {
        container.current.removeChild(script);
      }
    };
  }, [chartSymbol]);

  return (
    <div className="relative h-full min-h-[600px]">
      <div
        className="tradingview-widget-container"
        ref={container}
        style={{ height: "100%", width: "100%" }}
      >
        <div
          className="tradingview-widget-container__widget"
          style={{ height: "calc(100% - 32px)", width: "100%" }}
        ></div>
      </div>
      {isLoading && (
        <div className="absolute h-full inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <span className="text-white">Loading chart...</span>
        </div>
      )}
    </div>
  );
}

export default memo(TradingViewWidget);
