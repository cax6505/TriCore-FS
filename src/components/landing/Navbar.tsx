import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { label: "Visualization", to: "/visualization" },
        // { label: "Finder", to: "/finder" },
        // { label: "Theory", to: "/theory" },
        // { label: "Roadmap", to: "/roadmap" },
        { label: "Organiser", to: "/organiser" },
        { label: "FS Guide", to: "/guide" },
        
        { label: "Organiser Guide", to: "/organiser-guide" },
        { label: "NPM Package", to: "/npm-package" },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 30);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1280) {
                setMobileMenuOpen(false);
            }
        };

        window.addEventListener("resize", handleResize, { passive: true });
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div
            className="sticky top-0 z-50 flex flex-col"
            style={{ position: "sticky" }}
        >
            <nav
                className="bg-white flex items-stretch justify-between"
                style={{
                    margin: scrolled ? "0" : "16px 40px 0",
                    border: "1px solid #e7e7e7",
                    height: "48px",
                    transition: "margin 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
            >

                <div className="flex items-stretch">

                    <Link
                        to="/"
                        className="flex items-center gap-1.5 flex-shrink-0 px-6"
                        style={{ borderRight: "1px solid #e7e7e7" }}
                    >
                        <div
                            className="bg-black flex items-center justify-center"
                            style={{ width: "22px", height: "22px", padding: "3px" }}
                        >
                            <img src="/TricoreFS.ico" alt="SaveSpace" className="h-3.5 w-auto invert" />
                        </div>
                        <span className="text-[14px] font-medium text-black tracking-tight">SaveSpace</span>
                    </Link>


                    <div className="hidden xl:flex items-center gap-5 text-[14px] font-normal text-black px-6">
                        {navLinks.map((item) => (
                            <Link
                                key={item.to}
                                to={item.to}
                                className="hover:opacity-60 transition-opacity whitespace-nowrap"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>


                <div className="flex items-stretch">

                    <div className="xl:hidden flex items-center px-3 border-l border-r border-[#e7e7e7]">
                        <button
                            onClick={() => setMobileMenuOpen((prev) => !prev)}
                            className="w-8 h-8 inline-flex items-center justify-center text-black hover:bg-gray-50 transition-colors"
                            aria-label="Toggle navigation menu"
                            aria-expanded={mobileMenuOpen}
                        >
                            {mobileMenuOpen ? <X className="w-4 h-4" strokeWidth={1.8} /> : <Menu className="w-4 h-4" strokeWidth={1.8} />}
                        </button>
                    </div>


                    <div className="flex items-center gap-1.5 px-5">
                        <a
                            href="https://github.com/nandu-99/TriCoreFS"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <button
                                    className="hidden sm:inline-flex items-center justify-center text-[12px] font-medium text-black uppercase bg-white hover:bg-gray-50 transition-all"
                                    style={{
                                        letterSpacing: "0.48px",
                                        border: "1px solid #e7e7e7",
                                        padding: "6px 16px",
                                        height: "32px",
                                }}
                            >
                                GitHub
                            </button>
                        </a>
                        <Link to="/visualization">
                            <Button
                                className="text-[12px] font-medium text-white uppercase bg-black hover:bg-gray-900 transition-all"
                                style={{
                                    letterSpacing: "0.48px",
                                    border: "1px solid black",
                                    padding: "6px 16px",
                                    height: "32px",
                                }}
                            >
                                Try It Now
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>
            <div
                className="xl:hidden bg-white overflow-hidden transition-all duration-300"
                style={{
                    margin: scrolled ? "0" : "0 40px",
                    maxHeight: mobileMenuOpen ? "260px" : "0px",
                    opacity: mobileMenuOpen ? 1 : 0,
                    borderLeft: mobileMenuOpen ? "1px solid #e7e7e7" : "1px solid transparent",
                    borderRight: mobileMenuOpen ? "1px solid #e7e7e7" : "1px solid transparent",
                    borderBottom: mobileMenuOpen ? "1px solid #e7e7e7" : "1px solid transparent",
                }}
            >
                <div className="py-2">
                    {navLinks.map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-5 py-2.5 text-[13px] font-medium text-black hover:bg-gray-50 transition-colors"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};
