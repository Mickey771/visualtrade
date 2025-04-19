// types/withdrawal.ts

interface WithdrawalRequest {
  amount: string;
  network: string;
  wallet_address: string;
}

interface RequestHistory {
  amount: number;
  id: string;
  type: "deposit" | "withdrawal";
  wallet_address: string;
  approved: boolean;
}

interface RequestHistoryResponse {
  status: string;
  message: string;
  data: RequestHistory[];
}

interface WithdrawalResponse {
  status: string;
  message: string;
  data: {
    amount: number;
  };
}
