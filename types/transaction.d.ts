// types/transaction.ts

// interface Transaction {
//   id: string;
//   type: "BUY" | "SELL";
//   price: number;
//   closed?: boolean;
//   created_at: string;
//   meta_data: {
//     pair: string;
//     leverage?: string;
//     margin?: string;
//     quantity?: number;
//     boughtAt: string;
//     closedAt?: string;
//     order_type?: "market" | "limit";
//     profitLoss?: number;
//     profitLossPercentage?: number;
//   };
// }

interface Transaction {
  id: string;
  type: "BUY" | "SELL";
  price: number;
  closed: boolean;
  created_at: string;
  meta_data: {
    pair: string;
    boughtAt: string;
    closedAt?: string;
    leverage?: string;
    margin?: string;
    quantity?: number;
    profitLoss?: number;
    profitLossPercentage?: number;
    order_type?: "market" | "limit";
  };
}

interface TransactionsResponse {
  status: string;
  message: string;
  data: Transaction[];
  has_next: boolean;
}

interface TransactionsTableProps {
  loading: boolean;
  error: string | null;
  transactions: Transaction[];
  formatDate: (dateString: string) => string;
  handlePageChange: (newPage: number) => void;
  currentPage: number;
  hasNextPage: boolean;
  formatPair: (dateString: string) => string;
  isClosed: boolean;
}

interface Modal {
  isOpen: boolean;
  close: () => void;
  open: () => void;
  toggle: () => void;
}

interface ModalProps {
  modal: Modal;
}
