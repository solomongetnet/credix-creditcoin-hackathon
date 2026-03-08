"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"
type FAQItem = {
  question: string
  answer: string
}
type FAQSectionProps = {
  title?: string
  faqs?: FAQItem[]
}
const defaultFAQs: FAQItem[] = [
  {
    question: "What is CrediX and how does it work?",
    answer:
      "CrediX is a fintech solution designed specifically for freelancers to build credit scores and access micro-loans. We analyze your work history, project completion rates, and repayment behavior to create a reputation-based credit score. Instead of traditional employment history, we use your freelance activity to determine your creditworthiness, giving you access to affordable financing regardless of your location or banking history.",
  },
  {
    question: "How is my credit score calculated?",
    answer:
      "Your credit score is built on multiple factors: project completion rate, on-time payment history, client reviews and ratings, account age and activity, loan repayment behavior, and income consistency. Unlike traditional credit systems that only look at employment, we evaluate your entire freelance track record. Your score ranges from 300-850, and the higher your score, the better interest rates and loan amounts you qualify for.",
  },
  {
    question: "What types of loans does CrediX offer?",
    answer:
      "CrediX offers micro-loans ranging from $500 to $50,000 depending on your credit score, income history, and reputation level. These loans can be used for business investments, equipment purchases, cash flow management, or personal emergencies. Loan terms range from 3 to 36 months with fixed interest rates starting as low as 6.5% for excellent-rated borrowers. We also offer salary advance options for predictable income freelancers.",
  },
  {
    question: "Is my data secure with CrediX?",
    answer:
      "Yes, security is our top priority. We use bank-level encryption (AES-256) to protect all your personal and financial data. We only access the data you explicitly permit us to see from your freelance platforms, and we never sell your information to third parties. We are fully compliant with GDPR and CCPA regulations.",
  },
]
export const FAQSection = ({ title = "Frequently Asked Questions", faqs = defaultFAQs }: FAQSectionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }
  return (
    <section className="w-full py-24 px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-16">
          {/* Left Column - Title */}
          <div className="lg:col-span-4">
            <h2
              className="text-[40px] leading-tight font-normal text-[#202020] tracking-tight sticky top-24"
              style={{
                fontFamily: "var(--font-figtree), Figtree",
                fontWeight: "400",
                fontSize: "40px",
              }}
            >
              {title}
            </h2>
          </div>

          {/* Right Column - FAQ Items */}
          <div className="lg:col-span-8">
            <div className="space-y-0">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-[#e5e5e5] last:border-b-0">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between py-6 text-left group hover:opacity-70 transition-opacity duration-150"
                    aria-expanded={openIndex === index}
                  >
                    <span
                      className="text-lg leading-7 text-[#202020] pr-8"
                      style={{
                        fontFamily: "var(--font-figtree), Figtree",
                        fontWeight: "400",
                      }}
                    >
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{
                        rotate: openIndex === index ? 45 : 0,
                      }}
                      transition={{
                        duration: 0.2,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                      className="flex-shrink-0"
                    >
                      <Plus className="w-6 h-6 text-[#202020]" strokeWidth={1.5} />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {openIndex === index && (
                      <motion.div
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.3,
                          ease: [0.4, 0, 0.2, 1],
                        }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6 pr-12">
                          <p
                            className="text-lg leading-6 text-[#666666]"
                            style={{
                              fontFamily: "var(--font-figtree), Figtree",
                            }}
                          >
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
