import HeroSection from "@/components/common/hero-section";
import Brands from "@/components/common/brands";
import Exploring from "@/components/common/exploring";
import Something from "@/components/common/something";
import PopularMakes from "@/components/common/popular-makes";
import SellBuy from "@/components/common/sell-buy"
import Footer from "@/components/common/footer-section"
import Scroll from "@/components/pages/home/upp-button";
function MyHome() {
  return (
    <div>
      <HeroSection />
      <Brands />
      <Exploring />
      <Something />
      <PopularMakes />
      <SellBuy/>
      <Footer/>
       <Scroll/>
    </div>
  );
}

export default MyHome;
