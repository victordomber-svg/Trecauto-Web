import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { Toaster } from "sonner";
import "@/App.css";
import { Header } from "./components/site/Header";
import { Hero } from "./components/site/Hero";
import { Marquee } from "./components/site/Marquee";
import { About } from "./components/site/About";
import { Categories } from "./components/site/Categories";
import { Steps } from "./components/site/Steps";
import { RequestForm } from "./components/site/RequestForm";
import { Location } from "./components/site/Location";
import { Footer, FloatingCall } from "./components/site/Footer";

function App() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    window.__lenis = lenis;
    let id;
    const raf = (t) => { lenis.raf(t); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); lenis.destroy(); window.__lenis = null; };
  }, []);

  return (
    <div className="site" data-testid="trecauto-landing">
      <Header />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Categories />
        <Steps />
        <RequestForm />
        <Location />
      </main>
      <Footer />
      <FloatingCall />
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
