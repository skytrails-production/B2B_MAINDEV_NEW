import React, { useEffect, useRef, useState } from "react";
import { HeartIcon, MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import MenuBar from "./MenuBar";
import isInViewport from "./isInViewport";
import { Link } from "react-router-dom";

let WIN_PREV_POSITION = 0;
if (typeof window !== "undefined") {
    WIN_PREV_POSITION = window.scrollY; // Use scrollY instead of pageYOffset
}

const NAV = [
    {
        name: "Explore",
        link: "/",
        icon: MagnifyingGlassIcon,
    },
    {
        name: "Wishlists",
        link: "/account-savelists",
        icon: HeartIcon,
    },
    {
        name: "Log in",
        link: "/account",
        icon: UserCircleIcon,
    },
    {
        name: "Menu",
        icon: MenuBar,
    },
];

const FooterNav = () => {
    const containerRef = useRef(null);
    const [pathname, setPathname] = useState(window.location.pathname);

    useEffect(() => {
        window.addEventListener("scroll", handleEvent);
        return () => {
            window.removeEventListener("scroll", handleEvent);
        };
    }, []);

    const handleEvent = () => {
        window.requestAnimationFrame(showHideHeaderMenu);
    };

    const showHideHeaderMenu = () => {
        let currentScrollPos = window.scrollY;
        if (!containerRef.current) return;

        if (currentScrollPos > WIN_PREV_POSITION) {
            if (isInViewport(containerRef.current) && currentScrollPos - WIN_PREV_POSITION < 80) {
                return;
            }
            containerRef.current.classList.add("FooterNav--hide");
        } else {
            if (!isInViewport(containerRef.current) && WIN_PREV_POSITION - currentScrollPos < 80) {
                return;
            }
            containerRef.current.classList.remove("FooterNav--hide");
        }

        WIN_PREV_POSITION = currentScrollPos;
    };

    const renderItem = (item, index) => {
        const isActive = pathname === item.link;

        return item.link ? (
            <Link
                key={index}
                to={item.link}
                className={`flex flex-col items-center justify-between text-neutral-500 ${isActive ? "text-neutral-900" : ""}`}
            >
                <item.icon className={`w-6 h-6 ${isActive ? "text-red-600" : ""}`} />
                <span className={`text-[11px] leading-none mt-1 ${isActive ? "text-red-600" : ""}`}>
                    {item.name}
                </span>
            </Link>
        ) : (
            <div
                key={index}
                className={`flex flex-col items-center justify-between text-neutral-500 ${isActive ? "text-neutral-900" : ""}`}
            >
                <item.icon className="w-6 h-6" />
                <span className="text-[11px] leading-none mt-1">{item.name}</span>
            </div>
        );
    };

    return (
        <div
            ref={containerRef}
            className="FooterNav block md:hidden p-2 bg-white fixed top-auto bottom-0 inset-x-0 z-30 border-t border-neutral-300 transition-transform duration-300 ease-in-out"
        >
            <div className="w-full max-w-lg flex justify-around mx-auto text-sm text-center">
                {NAV.map(renderItem)}
            </div>
        </div>
    );
};

export default FooterNav;
