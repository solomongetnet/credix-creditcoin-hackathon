"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { TrendingUp, Users, PiggyBank, CreditCard } from "lucide-react"
import { Card } from "@/components/ui/card"

type Stat = {
  icon: React.ReactNode
  label: string
  value: string
  description: string
  endValue: number
}

const stats: Stat[] = [
  {
    icon: <PiggyBank className="w-8 h-8" />,
    label: "Total Liquidity Pool",
    value: "$2.4M",
    description: "Funds available for micro-loans",
    endValue: 2400000,
  },
  // {
  //   icon: <Users className="w-8 h-8" />,
  //   label: "Unbanked Freelancers",
  //   value: "1B+",
  //   description: "Worldwide population we serve",
  //   endValue: 1000000000,
  // },
  {
    icon: <CreditCard className="w-8 h-8" />,
    label: "Active Freelancers",
    value: "10k+",
    description: "Using CrediX platform",
    endValue: 12000,
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    label: "Loans Issued",
    value: "45,000+",
    description: "Successfully processed",
    endValue: 45000,
  },
]

type AnimatedCounterProps = {
  endValue: number
  duration?: number
  isVisible: boolean
}

const AnimatedCounter = ({ endValue, duration = 2, isVisible }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0)
  const countRef = useRef(0)

  useEffect(() => {
    if (!isVisible) return

    const increment = endValue / (duration * 60)
    const interval = setInterval(() => {
      countRef.current += increment
      if (countRef.current >= endValue) {
        setCount(endValue)
        clearInterval(interval)
      } else {
        setCount(Math.floor(countRef.current))
      }
    }, 1000 / 60)

    return () => clearInterval(interval)
  }, [isVisible, endValue, duration])

  return (
    <div className="text-4xl md:text-5xl font-bold text-primary">
      {count.toLocaleString()}
      {endValue >= 1000000 && count === endValue && "+"}
    </div>
  )
}

export const StatsSection = () => {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section className="py-24 bg-background" ref={ref}>
      <div className="mx-auto max-w-7xl px-8">
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-foreground"
            style={{ fontFamily: "Figtree" }}
          >
            Platform Impact
          </motion.h2>
          <p className="max-w-2xl mx-auto mt-4 text-xl text-foreground/70">
            See how CrediX is transforming financial access for freelancers worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="p-8 hover:shadow-lg transition-shadow duration-300 border-border/50 hover:border-primary/30">
                <div className="flex items-start justify-between mb-6">
                  <div className="p-3 rounded-lg bg-blue-50">
                    <div className="text-primary">{stat.icon}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <AnimatedCounter
                    endValue={stat.endValue}
                    isVisible={isVisible}
                  />
                </div>

                <div className="mb-3">
                  <h3
                    className="text-lg font-semibold text-foreground"
                    style={{ fontFamily: "Figtree" }}
                  >
                    {stat.label}
                  </h3>
                </div>

                <p className="text-sm text-muted-foreground" style={{ fontFamily: "Figtree" }}>
                  {stat.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
