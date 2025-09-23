import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Hero2 from "./components/Hero2";
import FeatureStrip from "./components/FeatureStrip";
import HowItWorks from "./components/HowItWorks";
import WhyChoose from "./components/WhyChoose";
import { useState } from "react";
import LoginModal from "./components/LoginModal";
import SignupModal from "./components/SignupModal";

function App() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  return (
    <div className="font-display bg-[#FAFAFA] w-full min-h-screen">
      <main>
        <Header setSignupOpen={setSignupOpen} setLoginOpen={setLoginOpen} />
        <Hero />
        {/* <Hero2 /> */}
        <FeatureStrip />
        <HowItWorks />
        <WhyChoose />
        <Footer />
      </main>
      {/* Triggers for demo (replace with your navbar buttons) */}
      <div className="fixed bottom-4 right-4 flex gap-2"></div>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <SignupModal open={signupOpen} onClose={() => setSignupOpen(false)} />
    </div>
  );
}

export default App;
