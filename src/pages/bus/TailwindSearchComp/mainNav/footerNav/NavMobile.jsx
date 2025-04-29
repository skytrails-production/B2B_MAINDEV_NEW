import React from "react";

import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import ButtonClose from "../../shared/ButtonClose";
const NAVIGATION_DEMO = [
    {
        id: 1,
        name: "Home",
        href: "/",
        children: [
            {
                name: "Submenu 1",
                href: "/submenu1",
                children: [],
            },
            {
                name: "Submenu 2",
                href: "/submenu2",
                children: [],
            },
        ],
    },
    {
        id: 2,
        name: "About",
        href: "/about",
        children: [
            {
                name: "Submenu 1",
                href: "/submenu1",
                children: [],
            },
            {
                name: "Submenu 2",
                href: "/submenu2",
                children: [],
            },
        ],
    },
];

const NavMobile = ({ data = NAVIGATION_DEMO, onClickClose }) => {


    console.log(data, "data")

    const _renderMenuChild = (item) => {
        return (
            <ul className="nav-mobile-sub-menu pl-6 pb-1 text-base">
                {item?.children?.map((i, index) => (
                    <Disclosure key={i.href + index} as="li">
                        <a
                            href={i.href}
                            className="flex px-4 text-neutral-900 text-sm font-medium rounded-lg hover:bg-neutral-100 mt-0.5"
                        >
                            <span className={`py-2.5 pr-3 ${!i.children ? "block w-full" : ""}`}>
                                {i.name}
                            </span>
                            {i.children && (
                                <span className="flex-1 flex" onClick={(e) => e.preventDefault()}>
                                    <Disclosure.Button as="span" className="py-2.5 flex justify-end flex-1">
                                        <ChevronDownIcon className="ml-2 h-4 w-4 text-neutral-500" aria-hidden="true" />
                                    </Disclosure.Button>
                                </span>
                            )}
                        </a>
                        {i.children && <Disclosure.Panel>{_renderMenuChild(i)}</Disclosure.Panel>}
                    </Disclosure>
                ))}
            </ul>
        );
    };

    const _renderItem = (item, index) => {
        return (
            <Disclosure key={item.id} as="li" className="text-neutral-900 ">
                <a
                    className="flex w-full px-4 font-medium uppercase tracking-wide text-sm hover:bg-neutral-100 rounded-lg"
                    href={item.href}
                >
                    <span className={`py-2.5 pr-3 ${!item.children ? "block w-full" : ""}`}>
                        {item.name}
                    </span>
                    {item.children && (
                        <span className="flex-1 flex" onClick={(e) => e.preventDefault()}>
                            <Disclosure.Button as="span" className="py-2.5 flex items-center justify-end flex-1 ">
                                <ChevronDownIcon className="ml-2 h-4 w-4 text-neutral-500" aria-hidden="true" />
                            </Disclosure.Button>
                        </span>
                    )}
                </a>
                {item.children && <Disclosure.Panel>{_renderMenuChild(item)}</Disclosure.Panel>}
            </Disclosure>
        );
    };

    return (
        <div className="overflow-y-auto w-full h-screen py-2 transition transform shadow-lg ring-1  bg-white  divide-y-2 divide-neutral-100">
            <div className="py-6 px-5">
                {/* <Logo /> */}
                <img src="https://theskytrails.com/static/media/logoSky.63ff4d7e95a8ed4a90ba8f28c3b8958a.svg" className="w-20 lg:w-52 md:w-44" alt="" />
                <div className="flex flex-col mt-5 text-neutral-700  text-sm">
                    <span>
                        Discover the most outstanding articles on all topics of life. Write your stories and share them.
                    </span>

                    {/* <div className="flex justify-between items-center mt-4">
                        <SocialsList itemClass="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 text-xl " />
                        <span className="block">
                            <SwitchDarkMode className="bg-neutral-100 " />
                        </span>
                    </div> */}
                </div>
                <span className="absolute right-2 top-2 p-1">
                    <ButtonClose onClick={onClickClose} />
                </span>
            </div>
            <ul className="flex flex-col py-6 px-2 space-y-1">{data?.map(_renderItem)}</ul>

        </div>
    );
};

export default NavMobile;
