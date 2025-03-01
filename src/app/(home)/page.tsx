"use client";
import LandingNavbar from "@/components/Landing/LandingNavbar";
import Banner from "@/components/Landing/Banner";
import WhyTradeCommodities from "@/components/Landing/WhyTradeCommodities";
import HowToTrade from "@/components/Landing/HowToTrade";
import ExploreOurCommodity from "@/components/Landing/ExploreOurCommodity";
import DontTake from "@/components/Landing/DontTake";
import FrequentlyAskedQuestions from "@/components/Landing/FrequentlyAskedQuestions";
import LatestArticle from "@/components/Landing/LatestArticle";
import Footer from "@/components/Footer";

export default function Home() {
  const symbols = ["C:EURUSD", "C:GBPUSD", "C:USDJPY"];

  return (
    <>
      <Banner />
      <WhyTradeCommodities />
      <HowToTrade />
      <ExploreOurCommodity />
      <DontTake />
      <FrequentlyAskedQuestions />
      <LatestArticle />
    </>
  );
}
