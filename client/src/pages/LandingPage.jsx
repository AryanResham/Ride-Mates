import { useState } from "react";

import Footer from "../components/landing/Footer";
import Header from "../components/landing/Header";
import Hero from "../components/landing/Hero";
import Hero2 from "../components/landing/Hero2";
import FeatureStrip from "../components/landing/FeatureStrip";
import HowItWorks from "../components/landing/HowItWorks";
import WhyChoose from "../components/landing/WhyChoose";
import LoginModal from "../components/landing/LoginModal";
import SignupModal from "../components/landing/SignupModal";

function LandingPage({ onNavigate }) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  return (
    <div className="font-display bg-[#FAFAFA] w-full min-h-screen">
      <main>
        <Header setSignupOpen={setSignupOpen} setLoginOpen={setLoginOpen} />
        {/* <Hero /> */}
        <Hero2 />
        <FeatureStrip />
        <HowItWorks />
        <WhyChoose />
        <Footer />
      </main>
      {/* Triggers for demo (replace with your navbar buttons) */}
      <div className="fixed bottom-4 right-4 flex gap-2"></div>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <SignupModal open={signupOpen} onClose={() => setSignupOpen(false)} onNavigate={onNavigate} />
    </div>
  );
}

export default LandingPage;
