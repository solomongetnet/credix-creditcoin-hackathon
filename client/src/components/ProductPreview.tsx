"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { TrendingUp, Star, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { WalletLoginButton } from "./WalletLoginButton"

export const ProductPreview = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="py-24 bg-blue-50">
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
            Your Dashboard
          </h2>
          <p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            style={{ fontFamily: "Figtree" }}
          >
            Real-time insights into your credit journey and loan opportunities
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Credit Score Card */}
          <motion.div variants={itemVariants}>
            <Card className="p-8 border-border/50 hover:shadow-lg transition-all duration-300 h-full">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2" style={{ fontFamily: "Figtree" }}>
                    Your Credit Score
                  </p>
                  <h3 className="text-4xl font-bold text-primary">760</h3>
                </div>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Excellent
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Score Range</span>
                  <span className="font-medium">300-850</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "67%" }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Your score improved by 45 points this month based on timely repayments
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Loan Progress Card */}
          <motion.div variants={itemVariants}>
            <Card className="p-8 border-border/50 hover:shadow-lg transition-all duration-300 h-full">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2" style={{ fontFamily: "Figtree" }}>
                    Active Loan
                  </p>
                  <h3 className="text-3xl font-bold text-foreground">$3,500</h3>
                </div>
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Repaid</span>
                  <span className="font-medium">$2,100 / $3,500</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "60%" }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Next payment due: Dec 15 • Interest rate: 8.5%
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Reputation Card */}
          <motion.div variants={itemVariants}>
            <Card className="p-8 border-border/50 hover:shadow-lg transition-all duration-300 h-full">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2" style={{ fontFamily: "Figtree" }}>
                    Reputation Level
                  </p>
                  <h3 className="text-3xl font-bold text-primary">Trusted</h3>
                </div>
                <Star className="w-6 h-6 text-primary fill-primary" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-foreground">94 projects completed</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-foreground">100% on-time payments</span>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Based on your work activity and payment history
                </p>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-lg text-muted-foreground mb-6" style={{ fontFamily: "Figtree" }}>
            Access your dashboard and start building your financial profile today
          </p>
          <WalletLoginButton
            redirectOnAuth
            className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-all duration-200 inline-block"
          >
            Get Started
          </WalletLoginButton>
        </motion.div>
      </div>
    </section>
  )
}
