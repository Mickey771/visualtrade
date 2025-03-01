import Image from "next/image";
import React from "react";

const TermsOfServiceDetails = () => {
  return (
    <section>
      <div className="relative w-full h-[350px]">
        <Image
          src={"/privacyp.jpg"}
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "100%", height: "100%" }}
          alt="privacyp"
          className="object-cover"
        />
        <div className="absolute h-full w-full top-0 left-0 flex justify-center items-end pb-28 bg-[rgba(8,25,55,0.75)] ">
          <h1 className="text-[2.5rem] text-white font-bold ">
            Terms of Service
          </h1>
        </div>
      </div>
      <div className="bg-[hsl(222,65%,8%)] p-[20px] md:p-[50px] lg:p-[75px]">
        <div className=" w-full max-w-max mx-auto flex flex-col gap-4 ">
          <h2 className="text-white font-semibold  mt-4 text-[20px]">
            Overview
          </h2>
          <p className="text-[rgba(255,255,255,0.7)] ">
            {" "}
            "We," "our," or "us" are all used to refer to Quantempowerai.com.
            You accept and agree to be bound by the following Terms of Use by
            visiting or using our website and services. Before using the
            website, please carefully read these terms. You should not use our
            services if you disagree with these terms.
          </p>

          <h2 className="text-white font-semibold  mt-4 text-[20px]">
            1. Overview of Information
          </h2>
          <p className="text-[rgba(255,255,255,0.7)] ">
            1.1 All users of our website, including visitors, registered
            clients, and any other parties using our services, are subject to
            these Terms of Use.
          </p>

          <p className="text-[rgba(255,255,255,0.7)] ">
            1.2 By using our website, you attest that you are at least eighteen
            years old and that you are legally able to sign contracts and make
            use of our services.
          </p>

          <h2 className="text-white font-semibold  mt-4 text-[20px]">
            2. Services
          </h2>
          <p className="text-[rgba(255,255,255,0.7)] ">
            2.1 We offer financial trading services, such as commodities,
            indices, foreign currency (Forex), and other associated goods
            ("Services").
          </p>

          <p className="text-[rgba(255,255,255,0.7)] ">
            2.2 We solely offer our services for trade and informational
            reasons. We do not offer particular trade suggestions or
            individualized investment advice.
          </p>

          <p className="text-[rgba(255,255,255,0.7)] ">
            2.3 We maintain the right, at any time and without previous notice,
            to change, suspend, or stop any aspect of our services.
          </p>

          <h2 className="text-white font-semibold  mt-4 text-[20px]">
            3. Registering an Account{" "}
          </h2>
          <p className="text-[rgba(255,255,255,0.7)] ">
            3.1 You might need to create an account in order to access some of
            our services' features. When you register, you promise to give true,
            up-to-date, and comprehensive information, and to keep it updated to
            ensure its accuracy.
          </p>

          <p className="text-[rgba(255,255,255,0.7)] ">
            3.2 You are in charge of protecting your login information. You
            consent to keeping your account information private and take
            accountability for any actions taken using your account.
          </p>

          <p className="text-[rgba(255,255,255,0.7)] ">
            3.3 If you breach these Terms of Use or do any fraudulent or
            unlawful activity, we retain the right to suspend or delete your
            account.
          </p>

          <h2 className="text-white font-semibold  mt-4 text-[20px]">
            4. Disclosure of Risk
          </h2>
          <p className="text-[rgba(255,255,255,0.7)] ">
            4.1 There is a high danger of losing all of your money while trading
            in commodities, foreign exchange, and other financial markets. You
            admit that you are well aware of the hazards associated with this
            type of trading and that you shouldn't risk money you can't afford
            to lose.
          </p>

          <p className="text-[rgba(255,255,255,0.7)] ">
            4.2 Past performance does not guarantee future outcomes. You accept
            full responsibility for your own trading choices and any ensuing
            gains or losses, and there is no assurance of success.
          </p>

          <h2 className="text-white font-semibold  mt-4 text-[20px]">
            5. Terms of Trade
          </h2>
          <p className="text-[rgba(255,255,255,0.7)] ">
            5.1 You consent to follow the trading guidelines, margin
            requirements, and other terms that we specify, which could change at
            any time.
          </p>

          <p className="text-[rgba(255,255,255,0.7)] ">
            5.2 In order to safeguard your account from significant loss, we
            retain the right to restrict access to trading platforms, cancel
            your trading positions, or impose additional margin requirements.
          </p>

          <p className="text-[rgba(255,255,255,0.7)] ">
            5.3 You are aware that price quotes and trade execution might be
            impacted by market volatility, liquidity, and other uncontrollable
            variables. Any inconsistencies or hold-ups in trade execution or
            order placement are not our responsibility.
          </p>

          <h2 className="text-white font-semibold  mt-4 text-[20px]">
            6. Charges and Remittances
          </h2>
          <p className="text-[rgba(255,255,255,0.7)] ">
            6.1 You commit to paying all relevant commissions, fees, spreads,
            and charges related to your trades. These charges will be made
            explicit on our website or in your account.
          </p>

          <p className="text-[rgba(255,255,255,0.7)] ">
            6.2 We maintain the right to change our commissions, fee schedule,
            or other fees at any time. You will be notified of any changes via
            email or the website.
          </p>

          <p className="text-[rgba(255,255,255,0.7)] ">
            6.3 All payments must be made within the time frames we provide and
            in the designated currency. Your account may be suspended or
            terminated if you don't make payments.
          </p>

          <h2 className="text-white font-semibold  mt-4 text-[20px]">
            7. Property Rights
          </h2>
          <p className="text-[rgba(255,255,255,0.7)] ">
            7.1 Quantempowerai.com or its licensors own all of the content on
            our website, including but not limited to text, graphics, logos,
            pictures, and software. This content is protected by intellectual
            property laws.
          </p>

          <p className="text-[rgba(255,255,255,0.7)] ">
            7.2 Without our prior written consent, you are not permitted to
            duplicate, distribute, alter, replicate, or create derivative works
            of any portion of the content.
          </p>

          <p className="text-[rgba(255,255,255,0.7)] ">
            7.3 You have been given a limited, non-exclusive, revocable
            permission to use our website's material for personal,
            non-commercial purposes only.
          </p>

          <h2 className="text-white font-semibold  mt-4 text-[20px]">
            8. Links to Third Parties
          </h2>
          <p className="text-[rgba(255,255,255,0.7)] ">
            Links to third-party websites or services that are not under our
            ownership or control may be found on our website. The practices,
            policies, and content of these third-party websites are not within
            our control. The terms and conditions of any third-party services
            you use apply.
          </p>

          <h2 className="text-white font-semibold  mt-4 text-[20px]">
            9. Closure
          </h2>
          <p className="text-[rgba(255,255,255,0.7)] ">
            9.1 For any reason, including violating these Terms of Use, we
            reserve the right to immediately and at our sole discretion to
            suspend or terminate your use of our website and services.
          </p>

          <p className="text-[rgba(255,255,255,0.7)] ">
            {" "}
            9.2 You must stop using the website and services immediately upon
            termination, and all licenses and rights granted to you under these
            terms will also end.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TermsOfServiceDetails;
