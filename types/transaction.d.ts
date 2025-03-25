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

interface TransactionsTableProps {
  loading: boolean;
  error: string | null;
  transactions: Transaction[];
  formatDate: (dateString: string) => string;
  handlePageChange: (newPage: number) => void;
  currentPage: number;
  hasNextPage: boolean;
  formatPair: (dateString: string) => string;
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
