import { useState } from "react";

import Footer from "../components/landing/Footer";
import Header from "../components/landing/Header";
import Hero2 from "../components/landing/Hero2";
import FeatureStrip from "../components/landing/FeatureStrip";
import HowItWorks from "../components/landing/HowItWorks";
import WhyChoose from "../components/landing/WhyChoose";
import LoginModal from "../components/landing/LoginModal";
import SignupModal from "../components/landing/SignupModal";

function LandingPage({ onTryDemo }) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  const openLogin = () => {
    setSignupOpen(false);
    setLoginOpen(true);
  };
  const openSignup = () => {
    setLoginOpen(false);
    setSignupOpen(true);
  };

  return (
    <div className="font-display bg-[#FAFAFA] w-full min-h-screen">
      <main>
        <Header setSignupOpen={openSignup} setLoginOpen={openLogin} onTryDemo={onTryDemo} />
        <Hero2 onTryDemo={onTryDemo} onSignup={openSignup} />
        <FeatureStrip />
        <HowItWorks />
        <WhyChoose />
        <Footer />
      </main>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} onSwitchToSignup={openSignup} onTryDemo={onTryDemo} />
      <SignupModal open={signupOpen} onClose={() => setSignupOpen(false)} onSwitchToLogin={openLogin} onTryDemo={onTryDemo} />
    </div>
  );
}

export default LandingPage;
