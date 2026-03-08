"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DollarSign,
  Calendar,
  TrendingDown,
  CheckCircle2,
  Clock,
  Loader2,
  AlertTriangle,
  XCircle,
  Database,
  ExternalLink,
} from "lucide-react";
import {
  useGetUserLoansQuery,
  useRepayLoanMutation,
} from "@/hooks/api/use-loan";
import { Loan } from "@/generated/prisma";
import { formatCTC, formatUSD, getLoanLimit } from "@/lib/utils/currency";
import { useGetUserProfileQuery } from "@/hooks/api/use-user";
import { useAvailablePoolBalance, useRepayLoanOnChain } from "@/hooks/api/blockchain/use-blockchain-loan";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

// ─────────────────────────────────────────────────────────────────────────────
// LoanCard with real on-chain repay flow
// ─────────────────────────────────────────────────────────────────────────────
const LoanCard = ({ loan }: { loan: any }) => {
  const balance = loan.amount - loan.repaidAmount;
  const progress = (loan.repaidAmount / loan.amount) * 100;
  const isOverdue = new Date(loan.dueDate) < new Date() && loan.status === "ACTIVE";
  const monthlyPaymentCTC = (loan.amount / 12).toFixed(2);
  const remainingMonths = Math.max(
    0,
    Math.ceil(
      (new Date(loan.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30),
    ),
  );

  // DB-only simulation repayment (for testing score simulation)
  const { mutateAsync: simulateRepay, isPending: isSimulating } = useRepayLoanMutation();

  // Real on-chain repay (approve + repayLoan)
  const { repayLoan: repayOnChain, isPending: isRepayingOnChain } = useRepayLoanOnChain();
  const queryClient = useQueryClient();

  const handleOnChainRepay = async () => {
    if (!loan.onChainLoanId && loan.onChainLoanId !== 0) {
      toast.error("This loan has no on-chain ID. Use simulation repayment instead.");
      return;
    }
    const hash = await repayOnChain(BigInt(loan.onChainLoanId), loan.amount);
    if (hash) {
      toast.success("Repayment confirmed on-chain!");
      // Also mark as repaid in DB
      await simulateRepay({ loanId: loan.id, type: "ON_TIME" });
      queryClient.invalidateQueries({ queryKey: ["user_loans"] });
    }
  };

  const isRepaying = isSimulating || isRepayingOnChain;

  return (
    <Card className="bg-card border border-border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Creditcoin Micro-Loan</h3>
          <p className="text-sm text-foreground/60 mt-1">
            Loan ID: #{loan.id.substring(loan.id.length - 6).toUpperCase()}
          </p>
          {loan.contractTxHash && (
            <a
              href={`https://creditcoin-testnet.blockscout.com/tx/${loan.contractTxHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
            >
              <ExternalLink className="w-3 h-3" />
              View on Creditcoin Explorer
            </a>
          )}
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            loan.status === "ACTIVE"
              ? "bg-accent/20 text-muted-foreground"
              : loan.status === "DEFAULTED"
                ? "bg-destructive/20 text-destructive"
                : loan.status === "LATE"
                  ? "bg-orange-500/20 text-orange-500"
                  : "bg-muted text-muted-foreground"
          }`}
        >
          {loan.status}
        </div>
      </div>

      {/* Key Info Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 py-4 border-y border-border/50">
        <div>
          <p className="text-xs text-foreground/60 mb-1">Total Amount</p>
          <p className="text-lg font-bold text-foreground">{formatCTC(loan.amount)}</p>
          <p className="text-xs text-foreground/50">{formatUSD(loan.amount)}</p>
        </div>
        <div>
          <p className="text-xs text-foreground/60 mb-1">Remaining Balance</p>
          <p className="text-lg font-bold text-foreground">{formatCTC(balance)}</p>
          <p className="text-xs text-foreground/50">{formatUSD(balance)}</p>
        </div>
        <div>
          <p className="text-xs text-foreground/60 mb-1">Interest Rate</p>
          <p className="text-lg font-bold text-foreground">{loan.interestRate}%</p>
        </div>
        <div>
          <p className="text-xs text-foreground/60 mb-1">Monthly Payment</p>
          <p className="text-lg font-bold text-foreground">{formatCTC(parseFloat(monthlyPaymentCTC))}</p>
          <p className="text-xs text-foreground/50">{formatUSD(parseFloat(monthlyPaymentCTC))}</p>
        </div>
      </div>

      {/* Progress Bar */}
      {loan.status === "ACTIVE" && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-foreground/70">Repayment Progress</p>
            <p className="text-xs font-semibold text-foreground">{progress.toFixed(0)}%</p>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Status Info */}
      <div className="flex items-center gap-4 text-sm mb-4">
        {loan.status === "ACTIVE" && (
          <>
            <div className="flex items-center gap-2 text-foreground/70">
              <Calendar className="w-4 h-4" />
              <span>Due: {new Date(loan.dueDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-foreground/70">
              <Clock className="w-4 h-4" />
              <span>{remainingMonths} months left</span>
            </div>
          </>
        )}
        {loan.status === "REPAID" && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <CheckCircle2 className="w-4 h-4" />
            <span>
              Completed on{" "}
              {loan.repaidAt
                ? new Date(loan.repaidAt).toLocaleDateString()
                : new Date(loan.dueDate).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      {loan.status === "ACTIVE" && (
        <div className="pt-4 border-t border-border/50 space-y-3">
          {/* Real on-chain repay (only when contractTxHash exists = real loan) */}
          {loan.contractTxHash && !loan.contractTxHash.startsWith("0x0") && (
            <div>
              <p className="text-xs text-foreground/60 mb-2">On-Chain Repayment</p>
              <Button
                className="w-full bg-primary hover:bg-primary/90"
                onClick={handleOnChainRepay}
                disabled={isRepaying}
              >
                {isRepayingOnChain ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Approving & Repaying...</>
                ) : (
                  <><CheckCircle2 className="w-4 h-4 mr-2" />Repay Loan On-Chain</>
                )}
              </Button>
            </div>
          )}

          {/* Simulation buttons for score testing */}
          <div>
            <p className="text-xs text-foreground/60 mb-2">Simulation Actions (Score Testing)</p>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="flex-1 border-accent text-muted-foreground hover:bg-accent hover:text-white"
                onClick={() => simulateRepay({ loanId: loan.id, type: "ON_TIME" })}
                disabled={isRepaying}
              >
                {isSimulating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                On-Time (+Score)
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                onClick={() => simulateRepay({ loanId: loan.id, type: "LATE" })}
                disabled={isRepaying}
              >
                {isSimulating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <AlertTriangle className="w-4 h-4 mr-2" />}
                Late (-Score)
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-white"
                onClick={() => simulateRepay({ loanId: loan.id, type: "DEFAULT" })}
                disabled={isRepaying}
              >
                {isSimulating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
                Default (--Score)
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Loans page
// ─────────────────────────────────────────────────────────────────────────────
export default function LoansPage() {
  const { data: loans = [], isLoading: isLoansLoading } = useGetUserLoansQuery();
  const { data: profileData, isLoading: isProfileLoading } = useGetUserProfileQuery();
  const { data: poolBalanceRaw } = useAvailablePoolBalance();

  const poolBalance = poolBalanceRaw ? Number(poolBalanceRaw as bigint) / 1e18 : 0;

  const user = profileData?.user;
  const creditScore = user?.CrediXScore || 0;
  const availableLimit = getLoanLimit(creditScore);

  const activeLoanCount = loans.filter((l) => l.status === "ACTIVE").length;
  const totalDebt = loans.reduce((sum, l) => sum + (l.amount - l.repaidAmount), 0);

  const nextDueDate = loans
    .filter((l) => l.status === "ACTIVE")
    .map((l) => new Date(l.dueDate))
    .sort((a, b) => a.getTime() - b.getTime())[0];

  if (isLoansLoading || isProfileLoading) {
    return (
      <div className="p-12 text-center text-foreground/70">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p>Loading your loans...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Loans</h1>
          <p className="text-foreground/70 mt-2">
            Manage your loans and track repayment progress
          </p>
        </div>
        <Link href="/dashboard/loans/new">
          <Button className="bg-primary hover:bg-primary/90">+ Request Loan</Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-primary/10 border border-primary/20 p-6">
          <Database className="w-6 h-6 text-primary mb-3" />
          <p className="text-foreground/70 text-sm">Pool Balance</p>
          <p className="text-3xl font-bold text-foreground mt-2">
            {poolBalance > 0 ? formatCTC(poolBalance) : "Loading..."}
          </p>
          {poolBalance > 0 && <p className="text-sm text-foreground/50">{formatUSD(poolBalance)}</p>}
        </Card>
        <Card className="bg-accent/10 border border-accent/20 p-6">
          <DollarSign className="w-6 h-6 text-accent mb-3" />
          <p className="text-foreground/70 text-sm">Available Limit</p>
          <p className="text-3xl font-bold text-foreground mt-2">{formatCTC(availableLimit)}</p>
          <p className="text-sm text-foreground/50">{formatUSD(availableLimit)}</p>
        </Card>
        <Card className="bg-destructive/10 border border-destructive/20 p-6">
          <DollarSign className="w-6 h-6 text-destructive mb-3" />
          <p className="text-foreground/70 text-sm">Total Debt</p>
          <p className="text-3xl font-bold text-foreground mt-2">{formatCTC(totalDebt)}</p>
          <p className="text-sm text-foreground/50">{formatUSD(totalDebt)}</p>
        </Card>
        <Card className="bg-accent/10 border border-accent/20 p-6">
          <TrendingDown className="w-6 h-6 text-muted-foreground mb-3" />
          <p className="text-foreground/70 text-sm">Active Loans</p>
          <p className="text-3xl font-bold text-foreground mt-2">{activeLoanCount}</p>
        </Card>
        {nextDueDate && (
          <Card className="bg-muted p-6">
            <Calendar className="w-6 h-6 text-foreground/70 mb-3" />
            <p className="text-foreground/70 text-sm">Next Payment Due</p>
            <p className="text-3xl font-bold text-foreground mt-2">
              {nextDueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </p>
          </Card>
        )}
      </div>

      {/* Loans List */}
      <div className="space-y-6">
        {loans.map((loan) => (
          <LoanCard key={loan.id} loan={loan} />
        ))}
      </div>

      {/* Empty State */}
      {loans.length === 0 && (
        <Card className="bg-muted/50 border-2 border-dashed border-border p-12 text-center">
          <DollarSign className="w-12 h-12 text-foreground/40 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No loans yet</h3>
          <p className="text-foreground/70 mb-6">Apply for your first loan to get started</p>
          <Link href="/dashboard/loans/new">
            <Button className="bg-primary hover:bg-primary/90">Request Your First Loan</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
