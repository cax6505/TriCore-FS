import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { GradientTransition } from "@/components/landing/GradientTransition";
import { Hero } from "@/components/landing/Hero";
import { Industries } from "@/components/landing/Industries";
import { Navbar } from "@/components/landing/Navbar";
import { ProcessFlow } from "@/components/landing/ProcessFlow";
import { Testimonials } from "@/components/landing/Testimonials";
import { SmoothScroll } from "@/components/ui/SmoothScroll";

const LandingPage = () => {
    return (
        <SmoothScroll>
            <div className="min-h-screen bg-white text-black font-sans selection:bg-blue-100 selection:text-blue-900">
                <Navbar />
                <main>
                    <Hero />
                    <ProcessFlow />
                    <GradientTransition />
                    <Industries />
                    <Testimonials />
                    <FinalCTA />
                </main>
                <Footer />
            </div>
        </SmoothScroll>
    );
};

export default LandingPage;
