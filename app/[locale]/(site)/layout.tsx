import Footer from "@/components/common/footer-section";
import HeroSection from "@/components/common/hero-section";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HeroSection />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
