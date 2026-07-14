import {
  Navbar,
  Hero,
  MarqueeTicker,
  HowItWorks,
  WhySection,
  Standings,
  CTASection,
  LandingFooter,
} from '../components/landing';

export function LandingPage() {
  return (
    <div className="w-full overflow-x-clip bg-black text-[#F5F5F5]">
      <Navbar />
      <Hero />
      <MarqueeTicker />
      <HowItWorks />
      <WhySection />
      <Standings />
      <CTASection />
      <LandingFooter />
    </div>
  );
}
