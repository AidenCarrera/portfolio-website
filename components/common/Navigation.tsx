"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface NavigationProps {
    currentPage?: string;
}

export default function Navigation({ currentPage }: NavigationProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router = useRouter();

    const navItems = [
        { id: "home", label: "Home", path: "/" },
        { id: "projects", label: "Projects", path: "/projects" },
        { id: "music", label: "Music", path: "/music" },
        { id: "contact", label: "Contact", path: "/contact" },
    ];

    const handleNavClick = (path: string) => {
        router.push(path); // navigate
        setMobileMenuOpen(false);
    };

    const hoverLift = { scale: 1.05, y: -2 }; // lift and slightly scale on hover

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <motion.button
                        onClick={() => handleNavClick("/")}
                        whileHover={hoverLift}
                        className="text-xl font-bold text-white hover:text-brand transition-colors"
                    >
                        Aiden Carrera
                    </motion.button>

                    <div className="hidden md:flex space-x-8">
                        {navItems.map((item) => (
                            <motion.button
                                key={item.id}
                                onClick={() => handleNavClick(item.path)}
                                whileHover={hoverLift}
                                className={`text-sm font-medium transition-colors ${
                                    currentPage === item.id
                                        ? "text-brand"
                                        : "text-slate-300 hover:text-white"
                                }`}
                            >
                                {item.label}
                            </motion.button>
                        ))}
                    </div>

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden text-white p-2"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="md:hidden bg-slate-800 border-t border-slate-700">
                    <div className="px-4 py-3 space-y-3">
                        {navItems.map((item) => (
                            <motion.button
                                key={item.id}
                                onClick={() => handleNavClick(item.path)}
                                whileHover={hoverLift}
                                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                                    currentPage === item.id
                                        ? "text-brand bg-slate-700"
                                        : "text-slate-300 hover:text-white hover:bg-slate-700"
                                }`}
                            >
                                {item.label}
                            </motion.button>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
