export const marketOptions: MarketOptions = {
  forex: {
    pairs: [
      // Major pairs
      "EURUSD",
      "USDJPY",
      "GBPUSD",
      "USDCHF",
      "USDCAD",
      "AUDUSD",
      "NZDUSD",
      "EURGBP",

      // Exotic pairs
      "USDHKD",
      "USDSGD",
      "USDTHB",
      "USDCNH",

      // Minor pairs
      "EURAUD",
      "EURCAD",
      "EURNZD",
      "EURCHF",
      "GBPJPY",
      "GBPCAD",
      "GBPAUD",
      "AUDCAD",
      "AUDJPY",
      "AUDNZD",
      "CADJPY",
      "NZDJPY",
      "CHFJPY",
      "GBPNZD",
    ],
  },
  crypto: {
    pairs: [
      // Major coins (15)
      "BTC/USDT",
      "ETH/USDT",
      "BNB/USDT",
      "XRP/USDT",
      "SOL/USDT",
      "ADA/USDT",
      "DOGE/USDT",
      "AVAX/USDT",
      "DOT/USDT",
      "LINK/USDT",
      "MEME/USDT",
      "SHIB/USDT",
      "LTC/USDT",
      "UNI/USDT",
      "ATOM/USDT",

      // Trending coins (10)
      "PEPE/USDT",
      "ARB/USDT",
      "OP/USDT",
      "APT/USDT",
      "FIL/USDT",
      "NEAR/USDT",
      "ALGO/USDT",
      "XLM/USDT",
      "VET/USDT",
      "TRUMP/USDT",
    ],
  },
  commodity: {
    pairs: ["GOLD", "SILVER", "COPPER", "NGAS", "USOIL", "UKOIL"],
  },
  stocks: {
    pairs: [
      // US Tech
      "AAPL.US",
      "MSFT.US",
      "GOOGL.US",
      "AMZN.US",
      "META.US",
      "TSLA.US",
      "NVDA.US",
      "INTC.US",
      "ADBE.US",
      "TSM.US",

      // US Other
      "JPM.US",
      "V.US",
      "WMT.US",
      "JNJ.US",
      "PG.US",

      "NVO.US",
      "PEP.US",
      "COST.US",
      "AVGO.US",
      "CVX.US",

      "HD.US",
      "ORCL.US",
      "ASML.US",
      "ABBV.US",
      "TM.US",
      "NAS100",
      "FRA40",
      "XETR",
      "US500",
      "US30",
      "UK100",
      "HK50",
      "JPN225",
    ],
  },
};
