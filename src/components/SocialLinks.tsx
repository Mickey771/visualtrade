import React, { useEffect, useState } from "react";
import { BsTelegram } from "react-icons/bs";
import { FaWhatsapp } from "react-icons/fa6";

interface SocialLink {
  name: string;
  link: string;
}

const SocialLinks = () => {
  const [whatsappLink, setWhatsappLink] = useState();
  const [telegramLink, setTelegramLink] = useState();
  const [loading, setIsLoading] = useState<boolean>(false);

  const fetchWalletAddresses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/social-links", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for authentication
      });

      const data = await response.json();
      if (data.status === "success" && Array.isArray(data.data)) {
        // setLinks(data.data);
        console.log("data", data);

        const whatsapp = data.data.find(
          (address: SocialLink) => address.name.toLowerCase() === "whatsapp"
        );
        setWhatsappLink(whatsapp.link);

        const telegram = data.data.find(
          (address: SocialLink) => address.name.toLowerCase() === "telegram"
        );
        setWhatsappLink(whatsapp.link);
        setTelegramLink(telegram.link);
      }
    } catch (error) {
      console.error("Error fetching socail links", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // console.log("fetching addresses");
    fetchWalletAddresses();
  }, []);

  return (
    <>
      {!loading && (
        <>
          <a
            target="_blank"
            href={whatsappLink}
            className="fixed bottom-10 right-10 bg-green-400 p-3 md:p-4 rounded-full text-white w-fit text-2xl md:text-4xl"
          >
            <FaWhatsapp className="" />
          </a>
          <a
            target="_blank"
            href={telegramLink}
            className="fixed bottom-10 left-10 bg-white rounded-full  text-[#6ca6e4] w-fit text-3xl md:text-6xl"
          >
            <BsTelegram className="" />
          </a>
        </>
      )}
    </>
  );
};

export default SocialLinks;
