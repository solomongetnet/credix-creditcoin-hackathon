"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { WalletLoginButton } from "./WalletLoginButton";

const rightImage =
  "https://img.freepik.com/premium-photo/vertical-happy-freelancer-man-working-home-with-laptop-desk-night-young-guy-smiling-browsing-internet-using-computer-living-room-entrepreneur-looking-bank-finances-invests_639864-408.jpg?semt=ais_rp_50_assets&w=740&q=80";
export const CrediXHero = () => {
  return (
    <div className="w-full overflow-hidden bg-background pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-8">
        <div className="grid grid-cols-12 gap-8 items-center">
          {/* Left content */}
          <div className="col-span-12 md:col-span-6 relative z-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-blue-50 border border-blue-200"
            >
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-sm font-medium text-blue-600">
                Empowering freelancers globally
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-6 text-foreground"
              style={{ fontFamily: "Figtree" }}
            >
              Turn Your Freelance Reputation Into Credit
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-muted-foreground mb-8 leading-relaxed"
              style={{ fontFamily: "Figtree" }}
            >
              CrediX helps freelancers build a credit score and access
              micro-loans using their work reputation and repayment history.
              Access financial services designed for the gig economy.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex gap-4 flex-wrap"
            >
              <WalletLoginButton
                redirectOnAuth
                className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-all duration-200 flex items-center gap-2 group"
              >
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </WalletLoginButton>
              <WalletLoginButton
                redirectOnAuth
                className="border-2 border-foreground text-foreground px-6 py-3 rounded-full font-semibold hover:bg-foreground/5 transition-all duration-200 flex items-center"
              >
                Build Your Credit
              </WalletLoginButton>
            </motion.div>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-border"
            >
              <div>
                <div className="text-2xl font-bold text-primary">12K+</div>
                <div className="text-sm text-muted-foreground">
                  Active Freelancers
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">45K+</div>
                <div className="text-sm text-muted-foreground">
                  Loans Issued
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">$2.4M</div>
                <div className="text-sm text-muted-foreground">
                  Liquidity Pool
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right side - Freelancer Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="col-span-12 md:col-span-6 relative"
          >
            <div className="relative w-full max-md:hidden md:max-h-[80vh] md:h-full rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://img.freepik.com/premium-photo/vertical-happy-freelancer-man-working-home-with-laptop-desk-night-young-guy-smiling-browsing-internet-using-computer-living-room-entrepreneur-looking-bank-finances-invests_639864-408.jpg?semt=ais_rp_50_assets&w=740&q=80"
                alt="Freelancer working with laptop"
                className="object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
