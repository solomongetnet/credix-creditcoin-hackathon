"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowRight, Check, AlertCircle, Loader2, Info, ExternalLink } from "lucide-react";
import { useCreateLoanMutation } from "@/hooks/api/use-loan";
import { useGetUserProfileQuery } from "@/hooks/api/use-user";
import { getLoanLimit, formatCTC, formatUSD } from "@/lib/utils/currency";
import { useRequestLoanOnChain } from "@/hooks/api/blockchain/use-blockchain-loan";
import { toast } from "sonner";

export default function NewLoanPage() {
  const [step, setStep] = useState(1);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    amount: "",
    term: "1",
    purpose: "",
  });

  const { data: profileData, isLoading: isProfileLoading } = useGetUserProfileQuery();
  const { mutateAsync: createLoan, isPending: isRecording } = useCreateLoanMutation();
  const { requestLoan, isPending: isSendingTx, isConfirming } = useRequestLoanOnChain();

  const user = profileData?.user;
  const creditScore = user?.CrediXScore || 0;
  const availableLimit = getLoanLimit(creditScore);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const ctcAmount = parseFloat(formData.amount) || 0;
  const isOverLimit = ctcAmount > availableLimit;

  const isSubmitting = isSendingTx || isConfirming || isRecording;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isOverLimit || ctcAmount <= 0) return;

    // Step 1: Call smart contract – tokens sent to user wallet on success
    toast("Sending transaction to blockchain...");
    const hash = await requestLoan(ctcAmount);

    if (!hash) return; // user rejected or error, already toasted

    setTxHash(hash);
    toast.success("On-chain loan approved! Recording in database...");

    // Step 2: Record in Prisma DB with the real tx hash
    const result = await createLoan({
      amount: ctcAmount,
      interestRate: 5,
      durationMonths: parseInt(formData.term),
      txHash: hash,
    });

    if (result.success) {
      setStep(3);
    }
  };

  if (isProfileLoading) {
    return (
      <div className="p-12 text-center text-foreground/70">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p>Loading your profile...</p>
      </div>
    );
  }

  const monthlyPaymentCTC =
    ctcAmount > 0 ? ((ctcAmount / parseInt(formData.term)) * 1.05).toFixed(2) : "0";

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground">Apply for a Loan</h1>
        <p className="text-foreground/70 mt-2">
          Get an instant micro-loan in cCTC — tokens sent directly to your wallet.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                s < step
                  ? "bg-accent text-white"
                  : s === step
                    ? "bg-primary text-white"
                    : "bg-muted text-foreground/60"
              }`}
            >
              {s < step ? <Check className="w-5 h-5" /> : s}
            </div>
            {s < 3 && (
              <div className={`h-1 flex-1 mx-2 rounded-full ${s < step ? "bg-accent" : "bg-muted"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Loan Details */}
      {step === 1 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setStep(2);
          }}
          className="space-y-6"
        >
          <Card className="bg-primary/10 border border-primary/20 p-6">
            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              Your Loan Limit: based on your current credit score ({creditScore})
            </h4>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">
                {formatCTC(availableLimit)}
              </span>
              <span className="text-foreground/60 font-medium">({formatUSD(availableLimit)})</span>
            </div>
          </Card>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Loan Amount (CTC)
            </label>
            <div className="relative flex items-center">
              <Input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Ex. 10"
                min="1"
                max={availableLimit}
                step="1"
                required
                className="flex-1 pr-16 text-lg"
              />
              <span className="absolute right-4 text-foreground/60 font-semibold">CTC</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm font-medium text-foreground/70">≈ {formatUSD(ctcAmount)} USD</p>
              {isOverLimit && (
                <p className="text-sm text-destructive font-semibold">Exceeds your limit</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Loan Term (months)
            </label>
            <select
              name="term"
              value={formData.term}
              onChange={(e) => setFormData((prev) => ({ ...prev, term: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
            >
              <option value="1">1 month</option>
              <option value="3">3 months</option>
              <option value="6">6 months</option>
              <option value="12">12 months</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Purpose of Loan
            </label>
            <textarea
              name="purpose"
              value={formData.purpose}
              onChange={handleInputChange}
              placeholder="Tell us how you plan to use this loan..."
              required
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/40"
            />
          </div>

          {/* Loan Preview */}
          {ctcAmount > 0 && !isOverLimit && (
            <Card className="bg-muted/30 border border-border p-6">
              <h4 className="font-semibold text-foreground mb-4">Loan Preview</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/70">Loan Amount</span>
                  <div className="text-right">
                    <div className="font-semibold text-foreground">{formatCTC(ctcAmount)}</div>
                    <div className="text-xs text-foreground/50">{formatUSD(ctcAmount)}</div>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/70">Interest Rate</span>
                  <span className="font-semibold text-foreground">5.0%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/70">Term</span>
                  <span className="font-semibold text-foreground">{formData.term} months</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="text-foreground/70">Estimated Monthly Payment</span>
                  <div className="text-right">
                    <div className="font-bold text-muted-foreground text-lg">
                      {formatCTC(parseFloat(monthlyPaymentCTC))}
                    </div>
                    <div className="text-xs text-foreground/50">
                      {formatUSD(parseFloat(monthlyPaymentCTC))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          <div className="flex pt-4">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={!formData.amount || !formData.purpose || isOverLimit}
            >
              Review & Confirm <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </form>
      )}

      {/* Step 2: Review & Confirm */}
      {step === 2 && (
        <div className="space-y-6">
          <Card className="bg-card border border-border p-8">
            <h3 className="text-xl font-semibold text-foreground mb-6">Review Your Application</h3>

            <div className="space-y-6 mb-8 pb-8 border-b border-border">
              <div className="flex justify-between items-center">
                <span className="text-foreground/70">Loan Amount</span>
                <div className="text-right">
                  <span className="font-semibold text-foreground block">{formatCTC(ctcAmount)}</span>
                  <span className="text-sm text-foreground/50">{formatUSD(ctcAmount)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground/70">Term</span>
                <span className="font-semibold text-foreground">{formData.term} months</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground/70">Interest Rate</span>
                <span className="font-semibold text-muted-foreground text-lg">5.0%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground/70">Monthly Payment</span>
                <div className="text-right">
                  <span className="font-bold text-muted-foreground text-lg block">
                    {formatCTC(parseFloat(monthlyPaymentCTC))}
                  </span>
                  <span className="text-sm text-foreground/50">
                    {formatUSD(parseFloat(monthlyPaymentCTC))}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 flex gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground/80">On-Chain Transaction</p>
                <p className="text-sm text-foreground/70 mt-1">
                   Submitting will send a <strong>real blockchain transaction</strong> on the Creditcoin Testnet.
                   Your MetaMask wallet will prompt you to confirm. cCTC tokens will be transferred
                   directly to your wallet address.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
                disabled={isSubmitting}
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {isSendingTx ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Confirm in MetaMask...
                  </>
                ) : isConfirming ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Confirming on-chain...
                  </>
                ) : isRecording ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Recording in database...
                  </>
                ) : (
                  "Submit & Get cCTC Tokens"
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Step 3: Success */}
      {step === 3 && (
        <Card className="bg-accent/10 border border-accent/20 p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
              <Check className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Loan Approved!</h2>
          <p className="text-foreground/70 mb-4">
            {formatCTC(ctcAmount)} have been sent to your wallet on Creditcoin Testnet.
          </p>
          {txHash && (
            <a
              href={`https://creditcoin-testnet.blockscout.com/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline text-sm mb-6"
            >
              <ExternalLink className="w-4 h-4" />
              View Transaction on Creditcoin Explorer
            </a>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Link href="/dashboard/loans">
              <Button variant="outline">View My Loans</Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-primary hover:bg-primary/90">Back to Dashboard</Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
