"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Lock, TrendingUp, Globe, Zap } from "lucide-react";
import Link from "next/link";
import { WalletLoginButton } from "./WalletLoginButton";

type Message = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const messages: Message[] = [
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Credit Access for Freelancers",
    description:
      "Build a credit score based on your work history, project completion rates, and repayment patterns—not just traditional employment.",
  },
  {
    icon: <Lock className="w-8 h-8" />,
    title: "Reputation-Based Financial System",
    description:
      "Your work reputation directly translates to financial opportunities. The more consistent you are, the better rates and higher loan amounts you qualify for.",
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Transparent Repayment Tracking",
    description:
      "Real-time dashboards show your loan status, interest rates, and repayment schedules. Full transparency so you know exactly what you owe and when.",
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Financial Inclusion Worldwide",
    description:
      "Access affordable credit regardless of location or traditional banking history. Empowering the global workforce to build financial security.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export const CoreMessagesSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2
            className="text-4xl md:text-5xl font-bold mb-4 text-foreground"
            style={{ fontFamily: "Figtree" }}
          >
            Why Choose CrediX?
          </h2>
          <p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            style={{ fontFamily: "Figtree" }}
          >
            Designed specifically for freelancers, by people who understand the
            gig economy
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {messages.map((message, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="p-8 border-border/50 hover:shadow-lg transition-all duration-300 h-full group">
                <div className="p-3 rounded-lg bg-blue-50 w-fit mb-6 group-hover:bg-blue-100 transition-colors">
                  <div className="text-primary">{message.icon}</div>
                </div>
                <h3
                  className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors"
                  style={{ fontFamily: "Figtree" }}
                >
                  {message.title}
                </h3>
                <p
                  className="text-muted-foreground leading-relaxed"
                  style={{ fontFamily: "Figtree" }}
                >
                  {message.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p
            className="text-xl text-muted-foreground mb-8"
            style={{ fontFamily: "Figtree" }}
          >
            Ready to take control of your financial future?
          </p>
          <WalletLoginButton
            redirectOnAuth
            className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold hover:bg-primary/90 transition-all duration-200 text-lg inline-block"
          >
            Start Building Your Credit Today
          </WalletLoginButton>
        </motion.div>
      </div>
    </section>
  );
};
