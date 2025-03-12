interface MarketData {
  cmd_id: number;
  data: {
    code: string;
    seq: string;
    tick_time: string;
    bids: PriceLevel[];
    asks: PriceLevel[];
  };
}
interface PriceLevel {
  price: string;
  volume: string;
}

interface MarketOptions {
  forex: {
    pairs: string[];
  };
  crypto: {
    pairs: string[];
  };
  commodity: {
    pairs: string[];
  };
  stocks: {
    pairs: string[];
  };
}
