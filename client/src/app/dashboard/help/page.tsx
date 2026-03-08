"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Search,
  MessageSquare,
  HelpCircle,
  Mail,
  Phone,
  ChevronDown,
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: "Getting Started",
    question: "How do I create an account?",
    answer:
      'Click the "Get Started" button on our homepage, fill in your basic information, verify your email, and you\'re ready to go. You can then complete your profile to unlock all features.',
  },
  {
    category: "Getting Started",
    question: "What information do I need to provide?",
    answer:
      "We require basic personal information including your name, date of birth, email, and phone number. To apply for loans, we'll need additional financial information.",
  },
  {
    category: "Credit Score",
    question: "How is my credit score calculated?",
    answer:
      "Your credit score is calculated based on several factors: 35% payment history, 30% credit utilization, 15% length of history, 10% credit mix, and 10% new inquiries. A higher score (max 850) indicates better creditworthiness.",
  },
  {
    category: "Credit Score",
    question: "How often is my credit score updated?",
    answer:
      "Your credit score is updated daily based on the latest information from credit bureaus. You can view historical trends on your dashboard.",
  },
  {
    category: "Loans",
    question: "What types of loans do you offer?",
    answer:
      "We offer Personal Loans, Home Loans, Education Loans, and Auto Loans. Each has different rates, terms, and requirements based on your profile and creditworthiness.",
  },
  {
    category: "Loans",
    question: "How quickly can I get approved for a loan?",
    answer:
      "Most loan applications are reviewed and approved within 24-48 hours. Our approval time depends on the completeness of your application and verification requirements.",
  },
  {
    category: "Security",
    question: "How is my data protected?",
    answer:
      "We use bank-grade encryption, secure servers, and industry-leading security protocols. Your financial data is never shared without your consent.",
  },
  {
    category: "Security",
    question: "How do I enable two-factor authentication?",
    answer:
      'Go to Settings > Account Security and click "Enable" next to Two-Factor Authentication. Follow the instructions to set it up with your phone.',
  },
];

const categories = ["All", ...Array.from(new Set(faqs.map((f) => f.category)))];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground">Help & Support</h1>
        <p className="text-foreground/70 mt-2">
          Find answers to your questions
        </p>
      </div>

      {/* Contact Options */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-primary/10 border border-primary/20 p-6 hover:shadow-md transition-shadow cursor-pointer">
          <Mail className="w-8 h-8 text-primary mb-4" />
          <h3 className="font-semibold text-foreground mb-2">Email Support</h3>
          <p className="text-sm text-foreground/70 mb-4">support@credix.com</p>
          <Button variant="ghost" className="text-primary hover:bg-primary/10">
            Contact Us
          </Button>
        </Card>

        <Card className="bg-accent/10 border border-accent/20 p-6 hover:shadow-md transition-shadow cursor-pointer">
          <Phone className="w-8 h-8 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-foreground mb-2">Phone Support</h3>
          <p className="text-sm text-foreground/70 mb-4">1-800-CREDIX</p>
          <Button
            variant="ghost"
            className="text-muted-foreground hover:bg-accent/10"
          >
            Call Now
          </Button>
        </Card>

        <Card className="bg-muted p-6 hover:shadow-md transition-shadow cursor-pointer">
          <MessageSquare className="w-8 h-8 text-foreground/60 mb-4" />
          <h3 className="font-semibold text-foreground mb-2">Live Chat</h3>
          <p className="text-sm text-foreground/70 mb-4">Chat with an agent</p>
          <Button variant="ghost">Start Chat</Button>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="bg-card border border-border p-6">
        <div className="flex items-center gap-3 bg-muted rounded-lg px-4 py-3">
          <Search className="w-5 h-5 text-foreground/60" />
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-foreground placeholder:text-foreground/40 outline-none"
          />
        </div>
      </Card>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${
              selectedCategory === cat
                ? "bg-primary text-white"
                : "bg-muted text-foreground/70 hover:bg-muted-foreground/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQs */}
      <div className="space-y-3">
        {filteredFAQs.length === 0 ? (
          <Card className="bg-muted/30 border border-dashed border-border p-8 text-center">
            <HelpCircle className="w-12 h-12 text-foreground/40 mx-auto mb-3" />
            <p className="text-foreground/60">
              No results found. Try a different search or contact support.
            </p>
          </Card>
        ) : (
          filteredFAQs.map((faq, idx) => (
            <Card
              key={idx}
              className="bg-card border border-border overflow-hidden hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                className="w-full text-left p-6 flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <p className="text-xs font-semibold text-primary/60 uppercase tracking-wider">
                    {faq.category}
                  </p>
                  <p className="font-semibold text-foreground mt-2">
                    {faq.question}
                  </p>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-foreground/60 transition-transform ${
                    expandedFAQ === idx ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedFAQ === idx && (
                <div className="px-6 pb-6 pt-0 border-t border-border/50 text-foreground/70">
                  <p>{faq.answer}</p>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Additional Resources */}
      <Card className="bg-primary/5 border border-primary/20 p-8">
        <h3 className="text-xl font-semibold text-foreground mb-4">
          Additional Resources
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <a href="#" className="text-primary hover:underline">
            → Credit Building Guide
          </a>
          <a href="#" className="text-primary hover:underline">
            → Loan Application FAQ
          </a>
          <a href="#" className="text-primary hover:underline">
            → Account Security Tips
          </a>
          <a href="#" className="text-primary hover:underline">
            → Dispute Resolution Process
          </a>
          <a href="#" className="text-primary hover:underline">
            → Terms of Service
          </a>
          <a href="#" className="text-primary hover:underline">
            → Privacy Policy
          </a>
        </div>
      </Card>

      {/* Feedback */}
      <Card className="bg-accent/5 border border-accent/20 p-8 text-center">
        <h3 className="text-xl font-semibold text-foreground mb-4">
          Was this helpful?
        </h3>
        <div className="flex gap-4 justify-center">
          <Button variant="outline">Yes, it helped</Button>
          <Button variant="outline">No, I still need help</Button>
        </div>
      </Card>
    </div>
  );
}
