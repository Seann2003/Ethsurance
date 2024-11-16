'use client';

import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { useFundWallet, usePrivy, type User, type WalletWithMetadata } from "@privy-io/react-auth";
import React, { Fragment } from "react";
import Icon from "./Icon";
import { sepolia } from "viem/chains";

export default function Wallet() {
    const { ready, authenticated, user } = usePrivy();
    const { fundWallet } = useFundWallet();

    const handleWalletFunding = async () => {
        try {
            if (user && user.wallet)
                await fundWallet(user.wallet.address, {
                    chain: sepolia
                });
        } catch (err) {
            console.error("Error Funding Embedded Wallet", err);
        }
    }

    const getEmbeddedPrivyWallet = (user: User): string | null => {
        const embeddedWallet = (user.linkedAccounts).find(
            (account) => account.type === "wallet" && account.walletClientType === "privy"
        ) as WalletWithMetadata;

        return embeddedWallet ? embeddedWallet.address : null;
    }

    return (
        <React.Fragment>
            {ready && authenticated && user ? (
                <Menu as="div" className="relative ml-3">
                    <MenuButton className="cursor-pointer flex gap-3 border border-violet-600 hover:border-violet-700 py-2 px-4 rounded-md text-violet-600 hover:text-violet-700  w-48">
                        <span className="sr-only">Open user menu</span>
                        <Icon name="bx-wallet" />
                        <div className="text-ellipsis overflow-hidden">
                            {getEmbeddedPrivyWallet(user)}
                        </div>
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
                                <div onClick={handleWalletFunding} className={"cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"}>
                                    Deposit
                                </div>
                            </MenuItem>
                            <MenuItem>
                                <div className={"cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"}>
                                    Withdraw
                                </div>
                            </MenuItem>
                        </MenuItems>
                    </Transition>
                </Menu>
            ) : null}
        </React.Fragment>
    );
}
