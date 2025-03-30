import { RootState } from "@/redux/reducers";
import { setTransactions } from "@/redux/reducers/tradeReducer";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useTransactions = () => {
  // const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const { transactions } = useSelector((store: RootState) => store.trade);

  const dispatch = useDispatch();
  const router = useRouter();

  const fetchTransactions = async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/transactions?page=${page}`, {
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Authentication error, redirect to login
          router.push("/login");
          return;
        }
        throw new Error(`Failed to fetch transactions: ${response.statusText}`);
      }

      const data: TransactionsResponse = await response.json();

      if (data.status === "success") {
        console.log("transactions", data);

        dispatch(setTransactions(data.data));
        setHasNextPage(data.has_next);
      } else {
        throw new Error(data.message || "Failed to fetch transactions");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching transactions"
      );
      console.error("Transaction fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0) {
      setCurrentPage(newPage);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Function to extract trading pair in a readable format
  const formatPair = (pair: string) => {
    if (pair?.length === 6) {
      return `${pair?.slice(0, 3)}/${pair.slice(3, 6)}`;
    }
    return pair;
  };

  const exportToCSV = () => {
    if (transactions?.length === 0) return;

    // Create CSV content
    const headers = [
      "ID",
      "Type",
      "Pair",
      "Price",
      "Quantity",
      "Leverage",
      "Margin",
      "Order Type",
      "Date",
    ];
    const csvContent = [
      headers.join(","),
      ...transactions.map((t) =>
        [
          t.id,
          t.type,
          t.meta_data.pair,
          t.price,
          t.meta_data.quantity || "-",
          t.meta_data.leverage || "-",
          t.meta_data.margin || "-",
          t.meta_data.order_type || "-",
          formatDate(t.created_at),
        ].join(",")
      ),
    ].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `transactions_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    loading,
    error,
    exportToCSV,
    transactions,
    formatDate,
    formatPair,
    handlePageChange,
    hasNextPage,
    currentPage,
    fetchTransactions,
  };
};
