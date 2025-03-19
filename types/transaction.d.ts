// types/transaction.ts

interface Transaction {
  id: string;
  type: "BUY" | "SELL";
  price: number;
  meta_data: {
    pair: string;
    margin?: number;
    leverage?: number;
    quantity?: number;
    order_type?: string;
    boughtAt?: string;
  };
  created_at: string;
  updated_at: string;
}

interface TransactionsResponse {
  status: string;
  message: string;
  data: Transaction[];
  has_next: boolean;
}
