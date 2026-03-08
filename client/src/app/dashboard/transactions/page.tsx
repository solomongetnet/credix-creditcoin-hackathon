"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  ArrowDownLeft,
  AlertCircle,
  Download,
  Filter,
} from "lucide-react";

interface Transaction {
  id: number;
  description: string;
  category: string;
  amount: number;
  type: "debit" | "credit" | "neutral";
  date: string;
  status: "completed" | "pending" | "failed";
}

const transactions: Transaction[] = [
  {
    id: 1,
    description: "Personal Loan Payment",
    category: "Loan",
    amount: 500,
    type: "debit",
    date: "2024-01-15",
    status: "completed",
  },
  {
    id: 2,
    description: "Salary Deposit",
    category: "Income",
    amount: 4500,
    type: "credit",
    date: "2024-01-15",
    status: "completed",
  },
  {
    id: 3,
    description: "Credit Inquiry",
    category: "Inquiry",
    amount: 0,
    type: "neutral",
    date: "2024-01-12",
    status: "completed",
  },
  {
    id: 4,
    description: "Home Loan Payment",
    category: "Loan",
    amount: 450,
    type: "debit",
    date: "2024-01-10",
    status: "completed",
  },
  {
    id: 5,
    description: "Late Payment Fee",
    category: "Fee",
    amount: 50,
    type: "debit",
    date: "2024-01-08",
    status: "completed",
  },
  {
    id: 6,
    description: "Interest Credit",
    category: "Savings",
    amount: 25,
    type: "credit",
    date: "2024-01-05",
    status: "completed",
  },
  {
    id: 7,
    description: "Emergency Loan Request",
    category: "Loan",
    amount: 2000,
    type: "credit",
    date: "2024-01-03",
    status: "completed",
  },
  {
    id: 8,
    description: "Loan Application Fee",
    category: "Fee",
    amount: 100,
    type: "debit",
    date: "2024-01-01",
    status: "completed",
  },
  {
    id: 9,
    description: "Credit Check Request",
    category: "Inquiry",
    amount: 0,
    type: "neutral",
    date: "2023-12-28",
    status: "pending",
  },
  {
    id: 10,
    description: "Disputed Transaction",
    category: "Dispute",
    amount: 150,
    type: "debit",
    date: "2023-12-25",
    status: "failed",
  },
  {
    id: 11,
    description: "Balance Transfer",
    category: "Transfer",
    amount: 1000,
    type: "debit",
    date: "2023-12-20",
    status: "completed",
  },
  {
    id: 12,
    description: "Refund Received",
    category: "Refund",
    amount: 75,
    type: "credit",
    date: "2023-12-18",
    status: "completed",
  },
];

export default function TransactionsPage() {
  const [filterType, setFilterType] = useState<
    "all" | "credit" | "debit" | "neutral"
  >("all");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "completed" | "pending" | "failed"
  >("all");
  const [sortBy, setSortBy] = useState("date");

  const filteredTransactions = transactions
    .filter((t) => {
      if (filterType !== "all" && t.type !== filterType) return false;
      if (filterStatus !== "all" && t.status !== filterStatus) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === "amount") {
        return Math.abs(b.amount) - Math.abs(a.amount);
      }
      return 0;
    });

  const totalCredit = transactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalDebit = transactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Transactions</h1>
          <p className="text-foreground/70 mt-2">
            View all your account activity
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-card border border-border p-6">
          <p className="text-foreground/70 text-sm mb-2">Total Income</p>
          <p className="text-3xl font-bold text-muted-foreground">
            ${totalCredit.toLocaleString()}
          </p>
          <p className="text-xs text-foreground/60 mt-2">
            {transactions.filter((t) => t.type === "credit").length}{" "}
            transactions
          </p>
        </Card>
        <Card className="bg-card border border-border p-6">
          <p className="text-foreground/70 text-sm mb-2">Total Expenses</p>
          <p className="text-3xl font-bold text-destructive">
            ${totalDebit.toLocaleString()}
          </p>
          <p className="text-xs text-foreground/60 mt-2">
            {transactions.filter((t) => t.type === "debit").length} transactions
          </p>
        </Card>
        <Card className="bg-card border border-border p-6">
          <p className="text-foreground/70 text-sm mb-2">Net Balance</p>
          <p
            className={`text-3xl font-bold ${totalCredit - totalDebit >= 0 ? "text-muted-foreground" : "text-destructive"}`}
          >
            ${(totalCredit - totalDebit).toLocaleString()}
          </p>
          <p className="text-xs text-foreground/60 mt-2">This period</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card border border-border p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <Filter className="w-5 h-5 text-foreground/60" />

          <div className="flex-1 flex flex-col md:flex-row gap-4">
            <div>
              <p className="text-sm font-medium text-foreground/70 mb-2">
                Type
              </p>
              <div className="flex gap-2">
                {["all", "credit", "debit", "neutral"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type as any)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      filterType === type
                        ? "bg-primary text-white"
                        : "bg-muted text-foreground/70 hover:bg-muted-foreground/10"
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-foreground/70 mb-2">
                Status
              </p>
              <div className="flex gap-2">
                {["all", "completed", "pending", "failed"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status as any)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      filterStatus === status
                        ? "bg-accent text-white"
                        : "bg-muted text-foreground/70 hover:bg-muted-foreground/10"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:ml-auto">
              <p className="text-sm font-medium text-foreground/70 mb-2">
                Sort By
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 rounded-lg border border-border bg-background text-foreground text-xs"
              >
                <option value="date">Date (Newest)</option>
                <option value="amount">Amount (Highest)</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Transactions List */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <Card className="bg-muted/30 border border-dashed border-border p-8 text-center">
            <AlertCircle className="w-12 h-12 text-foreground/40 mx-auto mb-3" />
            <p className="text-foreground/60">
              No transactions found with these filters.
            </p>
          </Card>
        ) : (
          filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    tx.type === "credit"
                      ? "bg-accent/10"
                      : tx.type === "debit"
                        ? "bg-destructive/10"
                        : "bg-primary/10"
                  }`}
                >
                  {tx.type === "credit" ? (
                    <ArrowDownLeft className="w-5 h-5 text-muted-foreground" />
                  ) : tx.type === "debit" ? (
                    <ArrowUpRight className="w-5 h-5 text-destructive" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-primary" />
                  )}
                </div>

                <div>
                  <p className="font-medium text-foreground">
                    {tx.description}
                  </p>
                  <div className="flex gap-3 text-xs text-foreground/60 mt-1">
                    <span>{tx.category}</span>
                    <span>•</span>
                    <span>{new Date(tx.date).toLocaleDateString()}</span>
                    {tx.status !== "completed" && (
                      <>
                        <span>•</span>
                        <span
                          className={`capitalize font-medium ${
                            tx.status === "pending"
                              ? "text-amber-600"
                              : "text-destructive"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <p
                className={`font-semibold text-right ${
                  tx.type === "credit"
                    ? "text-muted-foreground"
                    : tx.type === "debit"
                      ? "text-destructive"
                      : "text-foreground/60"
                }`}
              >
                {tx.type === "credit" ? "+" : tx.type === "debit" ? "-" : ""}
                {tx.amount > 0 ? `$${tx.amount.toLocaleString()}` : "Inquiry"}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Pagination Info */}
      <div className="text-center text-sm text-foreground/60">
        Showing {filteredTransactions.length} of {transactions.length}{" "}
        transactions
      </div>
    </div>
  );
}
