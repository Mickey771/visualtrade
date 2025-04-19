import { Box, Modal, CircularProgress } from "@mui/material";
import React, { useState, useEffect } from "react";
import { style } from "./config";
import QRCode from "react-qr-code";
import { FiCopy } from "react-icons/fi";
import { BsCheckCircleFill } from "react-icons/bs";

interface ModalProps {
  modal: {
    isOpen: boolean;
    close: () => void;
  };
}

interface CryptoPrice {
  code: string;
  price: string;
}

interface WalletAddress {
  address: string;
  chain: string;
}

const DepositModal: React.FC<ModalProps> = ({ modal }) => {
  const [amount, setAmount] = useState<string>("50");
  const [cryptoAmount, setCryptoAmount] = useState<string>("");
  const [selectedNetwork, setSelectedNetwork] = useState<string>("BTC");
  const [walletAddresses, setWalletAddresses] = useState<WalletAddress[]>([]);
  const [currentWalletAddress, setCurrentWalletAddress] = useState<string>("");
  const [cryptoPrices, setCryptoPrices] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [refreshCountdown, setRefreshCountdown] = useState<number>(20);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isNetworkDropdown, setIsNetworkDropdown] = useState<boolean>(false);

  // Fetch crypto prices with automatic refresh
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (modal.isOpen) {
      setShowPaymentDetails(false);
      setIsSubmitted(false);

      // Initial fetch
      fetchCryptoPrices();

      // Set up 20-second interval for refreshing prices
      intervalId = setInterval(() => {
        setRefreshCountdown(20);
        setIsRefreshing(true);
        fetchCryptoPrices().finally(() => {
          setIsRefreshing(false);
        });
      }, 20000);

      // Set up countdown timer
      const countdownId = setInterval(() => {
        setRefreshCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => {
        clearInterval(intervalId);
        clearInterval(countdownId);
      };
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [modal.isOpen]);

  // Update crypto amount when fiat amount, selected network, or crypto prices change
  useEffect(() => {
    if (amount && cryptoPrices[selectedNetwork]) {
      const price = parseFloat(cryptoPrices[selectedNetwork]);
      if (!isNaN(price) && price > 0) {
        const calculated = parseFloat(amount) / price;
        setCryptoAmount(calculated.toFixed(8));
      }
    }
  }, [amount, selectedNetwork, cryptoPrices]);

  // Update current wallet address when selected network changes
  useEffect(() => {
    const address = walletAddresses.find(
      (wallet) => wallet.chain === selectedNetwork
    );
    if (address) {
      setCurrentWalletAddress(address.address);
    }
  }, [selectedNetwork, walletAddresses]);

  // Fetch wallet addresses from API
  const fetchWalletAddresses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/wallet-address", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for authentication
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Authentication error, could redirect to login
          setError("Authentication required. Please log in again.");
          return;
        }
        throw new Error("Failed to fetch wallet addresses");
      }

      const data = await response.json();
      if (data.status === "success" && Array.isArray(data.data)) {
        setWalletAddresses(data.data);
        // Set default wallet address
        const btcWallet = data.data.find(
          (wallet: WalletAddress) => wallet.chain === "BTC"
        );
        if (btcWallet) {
          setCurrentWalletAddress(btcWallet.address);
        }
      }
    } catch (error) {
      console.error("Error fetching wallet addresses:", error);
      setError("Failed to fetch wallet addresses. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch crypto prices
  const fetchCryptoPrices = async () => {
    try {
      const pairs = ["BTCUSDT", "ETHUSDT"];
      const prices: Record<string, string> = {};

      for (const pair of pairs) {
        const response = await fetch(`/api/crypto-price?code=${pair}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch price for ${pair}`);
        }

        const data = await response.json();
        if (
          data.ret === 200 &&
          data.data.kline_list &&
          data.data.kline_list.length > 0
        ) {
          const code = pair.substring(0, 3); // Extract BTC, ETH, etc.
          prices[code] = data.data.kline_list[0].close_price;
        }
      }

      // Add USDT with 1:1 ratio to USD
      prices["USDT"] = "1";
      setCryptoPrices(prices);
      return prices;
    } catch (error) {
      console.error("Error fetching crypto prices:", error);
      //   setError("Failed to fetch current crypto prices. Please try again.");
      return null;
    }
  };

  // Handle amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
  };

  // Handle crypto amount change (for manual editing)
  const handleCryptoAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCryptoAmount(value);

    // Update USD amount based on crypto amount
    if (value && cryptoPrices[selectedNetwork]) {
      const price = parseFloat(cryptoPrices[selectedNetwork]);
      if (!isNaN(price) && price > 0) {
        const calculated = parseFloat(value) * price;
        setAmount(calculated.toFixed(2));
      }
    }
  };

  // Handle network change
  //   const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //     setSelectedNetwork(e.target.value);
  //   };
  const handleNetworkChange = (value: string) => {
    setSelectedNetwork(value);
    setIsNetworkDropdown(false);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setIsSubmitLoading(true);
    setError("");

    // Show payment details first
    setShowPaymentDetails(true);
    fetchWalletAddresses();
    setIsSubmitLoading(false);
  };

  // Handle payment confirmation
  const handlePaymentMade = async () => {
    setIsSubmitLoading(true);
    setError("");

    try {
      const response = await fetch("/api/deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for authentication
        body: JSON.stringify({
          amount: amount,
          network: selectedNetwork.toLowerCase(),
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Authentication required. Please log in again.");
          return;
        }
        throw new Error("Failed to submit deposit request");
      }

      const data = await response.json();
      if (data.status === "success") {
        setIsSubmitted(true);
      } else {
        throw new Error(data.message || "Failed to submit deposit request");
      }
    } catch (error) {
      console.error("Error submitting deposit:", error);
      setError("Failed to submit deposit request. Please try again.");
    } finally {
      setIsSubmitLoading(false);
    }
  };

  // Copy wallet address to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Manual refresh of crypto prices
  const handleManualRefresh = () => {
    setRefreshCountdown(20);
    setIsRefreshing(true);
    fetchCryptoPrices().finally(() => {
      setIsRefreshing(false);
    });
  };

  // Get network disclaimer based on selected network
  const getNetworkDisclaimer = () => {
    switch (selectedNetwork) {
      case "ETH":
        return "Please use ERC20 network for ETH transfers.";
      case "USDT":
        return "Please use ERC20 network for USDT transfers.";
      default:
        return "";
    }
  };

  return (
    <Modal
      open={modal.isOpen}
      onClose={modal.close}
      aria-labelledby="deposit-modal"
      aria-describedby="deposit-crypto-modal"
      className="backdrop-blur-[3px]"
    >
      <Box
        sx={style}
        className="bg-primaryBlue border max-h-[90%] overflow-y-scroll border-blue-400 py-[37px] px-[48px] md:max-w-[980px] max-w-[370px] w-full md:w-[980px] rounded-[0px]"
      >
        <h2 className="text-3xl text-white text-center font-bold">
          Crypto Wallet
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <CircularProgress sx={{ color: "white" }} />
          </div>
        ) : (
          <>
            {!showPaymentDetails ? (
              <>
                <p className="text-base text-gray-300 mt-10 leading-[30px]">
                  There may be extraordinary fees from your crypto service
                  provider. Money regularly takes 1 to 3 business hours to reach
                  your account, however it could take up to 24 hours or until
                  all confirmations are completed. If this is your case please
                  send to your manager:
                  <br />
                  1. Your Email
                  <br />
                  2. The text wallet address where you sent the money
                  <br />
                  3. Transaction hash
                  <br />
                  4. The amount
                </p>

                <form
                  className="mt-10 flex flex-col gap-10"
                  onSubmit={handleSubmit}
                >
                  <div>
                    <p className="text-white">Amount</p>
                    <div className="flex mt-3">
                      <input
                        type="number"
                        name="amount"
                        id="amount"
                        value={amount}
                        onChange={handleAmountChange}
                        className="py-4 w-[300px] border-blue-400 bg-[rgba(0,0,0,0.4)] text-white px-3"
                        placeholder="Enter amount"
                        min="1"
                        step="any"
                        required
                      />
                      <label
                        htmlFor="amount"
                        className="w-24 py-4 px-4 bg-blue-800 text-white flex items-center"
                      >
                        USD
                      </label>
                    </div>
                  </div>

                  <div className=" ">
                    <p className="text-white flex items-center justify-between ">
                      <span>Crypto Amount</span>
                    </p>
                    <div className="flex mt-3">
                      <input
                        type="number"
                        name="cryptoamount"
                        id="cryptoamount"
                        value={cryptoAmount}
                        onChange={handleCryptoAmountChange}
                        className="py-4 w-[300px] border-blue-400 bg-[rgba(0,0,0,0.4)] text-white px-3"
                        placeholder="Calculated amount"
                        step="any"
                      />
                      <div className="relative w-24  bg-blue-800 text-white flex items-center cursor-pointer">
                        <span
                          className="inline-flex w-full py-4 px-4"
                          onClick={() => setIsNetworkDropdown((prev) => !prev)}
                        >
                          {selectedNetwork}
                        </span>
                        {isNetworkDropdown && (
                          <div className="absolute w-full  top-full left-0 flex flex-col gap-1 bg-white text-primaryBlue">
                            <span
                              onClick={() => handleNetworkChange("BTC")}
                              className="hover:bg-primaryBlue hover:text-white cursor-pointer px-3 py-2"
                            >
                              BTC
                            </span>
                            <span
                              onClick={() => handleNetworkChange("ETH")}
                              className="hover:bg-primaryBlue hover:text-white cursor-pointer px-3 py-2"
                            >
                              ETH
                            </span>
                            <span
                              onClick={() => handleNetworkChange("USDT")}
                              className="hover:bg-primaryBlue hover:text-white cursor-pointer px-3 py-2"
                            >
                              USDT
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <span
                      className="text-xs mt-5 text-gray-400 flex items-center cursor-pointer hover:text-gray-300"
                      onClick={handleManualRefresh}
                    >
                      {isRefreshing ? (
                        <span className="flex items-center">
                          <CircularProgress
                            size={16}
                            sx={{ color: "gray", marginRight: "8px" }}
                          />
                          Refreshing...
                        </span>
                      ) : (
                        <span>
                          Price updates in: {refreshCountdown}s (click to
                          refresh)
                        </span>
                      )}
                    </span>
                  </div>

                  {error && (
                    <div className="bg-red-900/30 border border-red-500 text-red-300 p-3 rounded-md">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full sm:w-[396px] py-4 text-white bg-blue-800 hover:bg-blue-700 transition-colors rounded-md disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={isSubmitLoading}
                  >
                    {isSubmitLoading ? "Processing..." : "Submit"}
                  </button>
                </form>
              </>
            ) : (
              <div className="mt-8">
                {isSubmitted ? (
                  <div className="text-center">
                    <div className="flex justify-center">
                      <BsCheckCircleFill className="text-green-500 text-6xl mb-4" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Deposit Request Submitted!
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Your deposit request has been successfully submitted. It
                      may take 1-24 hours for the funds to be credited to your
                      account.
                    </p>
                    <button
                      onClick={modal.close}
                      className="px-6 py-3 bg-blue-800 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Please send your payment to the following address:
                    </h3>

                    <div className="bg-gray-900 rounded-lg p-6 mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-400">Amount to send:</span>
                        <span className="text-white font-semibold">
                          {cryptoAmount} {selectedNetwork}
                        </span>
                      </div>

                      <div className="bg-gray-900 p-4 rounded-lg mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">
                            Current {selectedNetwork} Price:
                          </span>
                          <span className="text-white font-semibold flex items-center">
                            ${cryptoPrices[selectedNetwork] || "Loading..."}
                            {isRefreshing ? (
                              <CircularProgress
                                size={16}
                                sx={{ color: "white", marginLeft: "8px" }}
                              />
                            ) : (
                              <span
                                className="text-xs text-gray-400 ml-2 cursor-pointer hover:text-gray-300"
                                onClick={handleManualRefresh}
                              >
                                Updates in: {refreshCountdown}s (refresh)
                              </span>
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-gray-700 my-4"></div>

                      <div className="mb-4">
                        <span className="text-gray-400 block mb-2">
                          Wallet Address:
                        </span>
                        <div className="flex items-center bg-gray-800 p-3 rounded">
                          <span className="text-white text-sm overflow-hidden text-ellipsis flex-1">
                            {currentWalletAddress}
                          </span>
                          <button
                            onClick={() =>
                              copyToClipboard(currentWalletAddress)
                            }
                            className="ml-2 text-blue-400 hover:text-blue-300"
                          >
                            {copied ? (
                              <BsCheckCircleFill className="text-green-500" />
                            ) : (
                              <FiCopy />
                            )}
                          </button>
                        </div>
                      </div>

                      {getNetworkDisclaimer() && (
                        <div className="bg-yellow-900/30 border border-yellow-600 text-yellow-300 p-3 rounded-md mb-4">
                          {getNetworkDisclaimer()}
                        </div>
                      )}

                      <div className="flex justify-center my-6">
                        <div className="bg-white p-4 rounded-lg">
                          <QRCode
                            value={currentWalletAddress}
                            size={200}
                            level="H"
                          />
                        </div>
                      </div>

                      <p className="text-gray-400 text-sm text-center mb-4">
                        Scan QR code by Mobile App
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={() => setShowPaymentDetails(false)}
                        className="px-6 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={handlePaymentMade}
                        className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        disabled={isSubmitLoading}
                      >
                        {isSubmitLoading ? "Processing..." : "Payment Made"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </Box>
    </Modal>
  );
};

export default DepositModal;
