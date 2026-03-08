import { PortfolioNavbar } from "@/components/PortfolioNavbar";
import { CrediXHero } from "@/components/CrediXHero";
import { StatsSection } from "@/components/StatsSection";
import { CoreMessagesSection } from "@/components/CoreMessagesSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";

export default function Page() {
  return (
    <div className="flex flex-col w-full">
      <PortfolioNavbar />
      <CrediXHero />
      <StatsSection />
      <CoreMessagesSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
