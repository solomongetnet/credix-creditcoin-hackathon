// import { useAccount, useConnect, useDisconnect } from 'wagmi'
// import { InjectedConnector } from 'wagmi/connectors/injected'
"use client";

import SmoothDrawer from "../kokonutui/smooth-drawer";

// function Wallet() {
//   const { connect } = useConnect({
//     connector: new InjectedConnector(), // MetaMask
//   })
//   const { disconnect } = useDisconnect()
//   const { address, isConnected } = useAccount()

//   return (
//     <div>
//       {isConnected ? (
//         <div>
//           <p>Connected as: {address}</p>
//           <button onClick={() => disconnect()}>Disconnect</button>
//         </div>
//       ) : (
//         <button onClick={() => connect()}>Connect Wallet</button>
//       )}
//     </div>
//   )
// }

import React, { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { Wallet } from "lucide-react";
import { BrowserProvider, ethers, JsonRpcSigner } from "ethers";
import { toast } from "sonner";
import {
  useConnectWalletToUserMutation,
  useDisConnectWalletToUserMutation,
} from "@/hooks/api/blockchain/use-wallet";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/store/auth-store";
const drawerVariants = {
  hidden: {
    y: "100%",
    opacity: 0,
    rotateX: 5,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  visible: {
    y: 0,
    opacity: 1,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      mass: 0.8,
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: {
    y: 20,
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      mass: 0.8,
    },
  },
};

const ConnectWallet = ({
  connectedWalletAddress,
}: {
  connectedWalletAddress: string | null;
}) => {
  const [account, setAccount] = useState<string | null>(null);
  const connectWalletMutation = useConnectWalletToUserMutation();
  const disConnectWalletMutation = useDisConnectWalletToUserMutation();

  async function handleConnectWallet() {
    if (typeof window === "undefined" || !(window as any).ethereum) {
      alert("MetaMask is not installed");
      return {
        account: null,
        provider: null,
        signer: null,
        chainId: null,
      };
    }

    try {
      // Request account access
      const accounts = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });

      const provider = new BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const chainId = await (window as any).ethereum.request({
        method: "eth_chainId",
      });

      connectWalletMutation
        .mutateAsync({
          address: accounts[0],
        })
        .then(({ success }) => {
          if (success) {
            location.reload();
          }
        });

      console.log({
        account: accounts[0],
        provider,
        signer,
        chainId,
      });
    } catch (error) {
      console.error("Wallet connection failed:", error);

      return {
        account: null,
        provider: null,
        signer: null,
        chainId: null,
      };
    }
  }

  async function handleDisconnect() {
    disConnectWalletMutation.mutateAsync().then(({ success }) => {
      if (success) {
        location.reload();
      }
    });
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="w-full py-5 rounded-full">
          {connectedWalletAddress
            ? `${connectedWalletAddress.slice(
                0,
                6
              )}...${connectedWalletAddress.slice(-4)}`
            : "Connect Wallet"}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="max-sm:w-[80vw] sm:w-[300px] md:w-[450px] mx-auto p-6 rounded-2xl shadow-xl">
        <motion.div
          variants={drawerVariants as any}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div variants={itemVariants as any}>
            <DrawerHeader className="px-0 space-y-2">
              <DrawerTitle className="text-2xl font-semibold">
                {connectedWalletAddress ? "Wallet Connected" : "Connect Wallet"}
              </DrawerTitle>
            </DrawerHeader>
          </motion.div>

          {/* ------------------------ CONNECT VIEW ------------------------ */}
          {!connectedWalletAddress && (
            <motion.div variants={itemVariants as any}>
              <DrawerFooter className="px-0 gap-3">
                <Button
                  onClick={handleConnectWallet}
                  disabled={connectWalletMutation.isPending}
                  className="w-full py-6"
                >
                  {connectWalletMutation.isPending
                    ? "Connecting..."
                    : "Connect Now"}
                </Button>

                <DrawerClose asChild>
                  <Button variant="outline" className="w-full rounded-xl">
                    Close
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </motion.div>
          )}

          {/* ------------------------ DISCONNECT VIEW ------------------------ */}
          {connectedWalletAddress && (
            <motion.div variants={itemVariants as any}>
              <DrawerFooter className="px-0 gap-3">
                <div className="text-center text-sm font-medium mb-2">
                  Connected as:
                  <br />
                  <span className="font-mono text-zinc-600">
                    {connectedWalletAddress.slice(0, 6)}...
                    {connectedWalletAddress.slice(-4)}
                  </span>
                </div>

                <Button
                  onClick={handleDisconnect}
                  disabled={disConnectWalletMutation.isPending}
                  className="w-full py-6 bg-red-500 hover:bg-red-600 text-white"
                >
                  {disConnectWalletMutation.isPending
                    ? "Disconnecting..."
                    : "Disconnect"}
                </Button>

                <DrawerClose asChild>
                  <Button variant="outline" className="w-full rounded-xl">
                    Close
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </motion.div>
          )}
        </motion.div>
      </DrawerContent>
    </Drawer>
  );
};

export default ConnectWallet;
