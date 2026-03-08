"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  DollarSign,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useAccount, useReadContract } from "wagmi";
import { useGetUserProfileQuery } from "@/hooks/api/use-user";
import { Skeleton } from "@/components/ui/skeleton";
import { getLoanLimit, formatCTC, formatUSD } from "@/lib/utils/currency";
import { WelcomeModal } from "@/components/welcome-modal";

const creditScoreData = [
  { month: "Jan", score: 30 },
  { month: "Feb", score: 35 },
  { month: "Mar", score: 40 },
  { month: "Apr", score: 45 },
  { month: "May", score: 50 },
  { month: "Jun", score: 60 },
];

const transactionData = [
  { name: "Jan", amount: 1200 },
  { name: "Feb", amount: 1400 },
  { name: "Mar", amount: 1600 },
  { name: "Apr", amount: 1350 },
  { name: "May", amount: 1800 },
  { name: "Jun", amount: 2100 },
];

const transactions = [
  {
    id: 1,
    description: "Loan Payment",
    amount: -500,
    type: "debit",
    date: "2024-01-15",
  },
  {
    id: 2,
    description: "Credit Inquiry",
    amount: 0,
    type: "neutral",
    date: "2024-01-12",
  },
  {
    id: 3,
    description: "Payment Received",
    amount: 2000,
    type: "credit",
    date: "2024-01-10",
  },
  {
    id: 4,
    description: "Late Payment Fee",
    amount: -50,
    type: "debit",
    date: "2024-01-08",
  },
];

export default function DashboardPage() {
  const { data: profileData, isLoading } = useGetUserProfileQuery();
  const { address } = useAccount();

  // Fetch cCTC balance using Wagmi (assuming ERC20 standard balanceOf)
  const { data: cCTCBalanceData } = useReadContract({
    address:
      (process.env.NEXT_PUBLIC_CCTC_ADDRESS as `0x${string}`) ||
      "0x5352E4bc9Eaf5b86ea0cfE29a6741CA087dB4C32", // fallback for demo
    abi: [
      {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function",
      },
    ],
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const walletBalance = cCTCBalanceData ? Number(cCTCBalanceData) / 1e18 : 0;

  const user = profileData?.user;
  const firstName = user?.name ? user.name.split(" ")[0] : "Freelancer";
  const creditScore = user?.CrediXScore || 0;

  const activeLoans =
    user?.loans?.filter((l: any) => l.status === "ACTIVE") || [];
  const totalLoanBalance = activeLoans.reduce(
    (sum: number, l: any) => sum + l.amount,
    0,
  );

  const availableLimit = getLoanLimit(creditScore);
  const creditScoreTrend = "+5 pts this month";

  if (isLoading) {
    return (
      <div className="space-y-8 flex flex-col h-full opacity-50 pointer-events-none">
        <Skeleton className="h-12 w-64" />
        <div className="grid md:grid-cols-4 gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <WelcomeModal />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">
            Welcome back, {firstName}!
          </h1>
          <p className="text-foreground/70 mt-2">
            Here's your financial overview
          </p>
        </div>
        <Link href="/dashboard/loans/new">
          <Button className="bg-primary hover:bg-primary/90">
            + New Loan Request
          </Button>
        </Link>
      </div>

      {/* Top Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          {
            label: "Wallet Balance",
            value: formatCTC(walletBalance),
            subtext: formatUSD(walletBalance),
            icon: DollarSign,
            color: "text-primary",
          },
          {
            label: "Credit Score",
            value: `${creditScore}/100`,
            subtext: creditScoreTrend,
            icon: TrendingUp,
            color: "text-muted-foreground",
          },
          {
            label: "Available Limit",
            value: formatCTC(availableLimit),
            subtext: formatUSD(availableLimit),
            icon: DollarSign,
            color: "text-primary",
          },
          {
            label: "Active Debt",
            value: formatCTC(totalLoanBalance),
            subtext: formatUSD(totalLoanBalance),
            icon: ArrowUpRight,
            color: "text-destructive",
          },
          {
            label: "Account Health",
            value:
              creditScore > 80
                ? "Excellent"
                : creditScore > 60
                  ? "Good"
                  : creditScore >= 31
                    ? "Fair"
                    : "Poor",
            subtext:
              activeLoans.length > 0
                ? `${activeLoans.length} active loans`
                : "No active loans",
            icon: CheckCircle,
            color: "text-muted-foreground",
          },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="bg-card border border-border p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-foreground/70 text-sm font-medium">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {stat.value}
                  </p>
                  <p className="text-foreground/60 text-xs mt-2">
                    {stat.subtext}
                  </p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color} opacity-60`} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Credit Score Trend */}
        <Card className="bg-card border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Credit Score Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={creditScoreData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--foreground)" opacity={0.5} />
              <YAxis
                stroke="var(--foreground)"
                opacity={0.5}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "var(--foreground)" }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="var(--accent)"
                strokeWidth={2}
                dot={{ fill: "var(--accent)", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Income vs Expenses */}
        <Card className="bg-card border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Income Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={transactionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--foreground)" opacity={0.5} />
              <YAxis stroke="var(--foreground)" opacity={0.5} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "var(--foreground)" }}
              />
              <Bar
                dataKey="amount"
                fill="var(--primary)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/dashboard/loans/new">
          <Card className="bg-primary/10 border border-primary/20 p-6 hover:bg-primary/15 transition-colors cursor-pointer">
            <DollarSign className="w-8 h-8 text-primary mb-4" />
            <h4 className="font-semibold text-foreground">Apply for Loan</h4>
            <p className="text-sm text-foreground/70 mt-2">
              Get quick approval for your loan
            </p>
          </Card>
        </Link>
        <Link href="/dashboard/credit">
          <Card className="bg-accent/10 border border-accent/20 p-6 hover:bg-accent/15 transition-colors cursor-pointer">
            <TrendingUp className="w-8 h-8 text-muted-foreground mb-4" />
            <h4 className="font-semibold text-foreground">Improve Credit</h4>
            <p className="text-sm text-foreground/70 mt-2">
              Tips to boost your credit score
            </p>
          </Card>
        </Link>
        <Link href="/dashboard/profile">
          <Card className="bg-primary/10 border border-primary/20 p-6 hover:bg-primary/15 transition-colors cursor-pointer">
            <AlertCircle className="w-8 h-8 text-primary mb-4" />
            <h4 className="font-semibold text-foreground">Update Profile</h4>
            <p className="text-sm text-foreground/70 mt-2">
              Keep your information current
            </p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
