import { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { IoClose } from "react-icons/io5";
import { style } from "./config";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/reducers";
import { setTransactions } from "@/redux/reducers/tradeReducer";

const ClosePositionModal: React.FC<ModalProps> = ({ modal }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { selectedTransaction, transactions } = useSelector(
    (store: RootState) => store.trade
  );

  const dispatch = useDispatch();

  const submitTrade = async () => {
    // Clear previous messages
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const tradeData = {
        meta_data: {
          closedAt: selectedTransaction?.meta_data.boughtAt,
        },
        id: selectedTransaction?.id,
      };

      // Use the Next.js API route to proxy the request
      const endpoint = `/api/trade/close`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tradeData),
      });

      const data = await response.json();

      console.log("response", response);

      if (!response.ok) {
        throw new Error(data.message || `Failed to close trade`);
      }

      const newTransactions = transactions.filter(
        (transaction) => transaction.id !== selectedTransaction?.id
      );
      dispatch(setTransactions(newTransactions));
      modal.close();
    } catch (error) {
      // Handle and display errors
      setErrorMessage(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={modal.isOpen}
      onClose={modal.close}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="backdrop-blur-[3px]"
    >
      <Box
        sx={style}
        className="bg-white py-[37px] px-[48px] md:max-w-[680px] max-w-[370px] w-full md:w-[680px] rounded-[15px] "
      >
        <h2 className=" text-zinc-800 flex justify-between text-2xl font-semibold font-['Poppins']">
          Close Position
          <button onClick={modal.close}>
            <IoClose />
          </button>
        </h2>
        <p className="text-zinc-800 mt-8 mb-[0px] text-base font-normal font-['Poppins']">
          Trade: {selectedTransaction?.id}
        </p>
        <p className="text-zinc-800 mt-4 mb-[73px] text-xl flex justify-between font-normal font-['Poppins']">
          <span className="font-bold ">
            {selectedTransaction?.meta_data.pair}
          </span>{" "}
          <span>{selectedTransaction?.price}</span>
        </p>

        <div className="w-full  flex gap-[22px] justify-end">
          <button
            onClick={modal.close}
            className="w-[173px] h-[58px] bg-[#54163E12] rounded-[10px]"
          >
            <span className="text-zinc-800 text-lg font-medium font-['Poppins']">
              Cancel
            </span>
          </button>
          <button
            disabled={isSubmitting}
            onClick={submitTrade}
            className="w-[173px] h-[58px] hover:bg-white hover:text-primaryBlue text-white  border border-primaryBlue bg-primaryBlue rounded-[10px]"
          >
            <span className="text-lg font-medium font-['Poppins'] disabled:opacity-50 ">
              {isSubmitting ? "Processing..." : "Close Trade"}
            </span>
          </button>
        </div>
      </Box>
    </Modal>
  );
};

export default ClosePositionModal;
