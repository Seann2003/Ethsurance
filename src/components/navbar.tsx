import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { Fragment } from "react";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { usePrivy } from "@privy-io/react-auth";

function classNames(...classes: Array<string | boolean>): string {
  return classes.filter(Boolean).join(" ");
}

const extractTabFromPath = (path: string) => {
  return path.split("/").pop() as string;
};

export type NavbarItem = {
  id: string;
  name: string;
  resource: string;
};

type NavbarProps = {
  accountId: string;
  items: Array<NavbarItem>;
};

export default function Navbar({ items, accountId }: NavbarProps) {
  const router = useRouter();
  const pathName = usePathname();
  const selected = extractTabFromPath(pathName);

  const { logout } = usePrivy();

  const selectedItemClass = "hover:cursor-pointer rounded-full bg-gray-900 px-3 py-2 text-lg font-medium text-white";
  const unselectedItemClass = "hover:cursor-pointer rounded-full px-3 py-2 text-lg font-medium text-gray-300 hover:bg-gray-700 hover:text-white";

  const navigateTo = (item: NavbarItem) => {
    router.push(`/${item.resource}/${item.id}`);
  };

  return (
    <Disclosure as="nav" className="px-4 sm:px-20 py-6 sm:py-10 bg-gray-800">
      {({ open }) => (
        <React.Fragment>
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {/* <Logo className="block h-8 w-auto lg:hidden mb-2" /> */}
                <Image src="/logos/ethsurance.png" width={100} height={100} alt={"ethsurance logo"}/>
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {items?.map((item) => (
                    <button type="button"
                      key={item.id}
                      onClick={() => navigateTo(item)}
                      className={selected === item.id ? selectedItemClass : unselectedItemClass}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <Menu as="div" className="relative ml-3">
                <MenuButton className="flex bg-gray-800 rounded-full items-center text-sm">
                  <span className="sr-only">Open user menu</span>
                  <Image className="h-8 w-8 rounded-full" src="/images/avatar.png" alt="avatar placeholder" height="32" width="32" />
                  <ChevronDownIcon className="ml-1 h-4 w-4 text-white" aria-hidden="true" />
                </MenuButton>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <MenuItem>
                      {({ active }) => (
                        <a href={`/accounts/${accountId}`} className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700")}>
                          Your account
                        </a>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <a href="#" className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700")}>
                          Settings
                        </a>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <a onClick={logout} className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700")}>
                          Sign out
                        </a>
                      )}
                    </MenuItem>
                  </MenuItems>
                </Transition>
              </Menu>
            </div>
            <div className="-mr-2 flex sm:hidden">
              <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="sr-only">Open main menu</span>
                {open ? <XMarkIcon className="block h-6 w-6" aria-hidden="true" /> : <Bars3Icon className="block h-6 w-6" aria-hidden="true" />}
              </DisclosureButton>
            </div>
          </div>

          {/* Mobile Sidebar */}
          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <DisclosurePanel className="fixed inset-0 z-40 flex bg-gray-800 bg-opacity-75">
              <div className="relative flex w-64 max-w-full flex-col p-6 bg-gray-900 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                <Image src="/logos/ethsurance.png" width={100} height={100} alt={"ethsurance logo"}/>
                  <DisclosureButton as="button" className="p-2 text-gray-400 hover:text-white">
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </DisclosureButton>
                </div>
                <nav className="flex flex-col space-y-4">
                  {items?.map((item) => (
                    <button
                    type="button"
                      key={item.id}
                      onClick={() => {
                        navigateTo(item);
                      }}
                      className={classNames(selected === item.id ? selectedItemClass : unselectedItemClass, "w-full text-left")}
                    >
                      {item.name}
                    </button>
                  ))}
                </nav>
                <div className="mt-auto pt-6">
                  <button
                    type="button"
                    onClick={logout}
                    className="w-full rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </DisclosurePanel>
          </Transition>
        </React.Fragment>
      )}
    </Disclosure>
  );
}
