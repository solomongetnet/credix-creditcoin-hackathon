"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { LoanStatus } from "@/generated/prisma";
import { getLoanLimit } from "@/lib/utils/currency";

const SESSION_COOKIE = "CrediX_wallet_session";

// Helper to get connected user
async function getConnectedUser() {
  const session = (await cookies()).get(SESSION_COOKIE);
  if (!session || !session.value) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { walletAddress: session.value },
  });

  return user;
}

export async function createLoanAction(data: {
  amount: number;
  interestRate: number;
  durationMonths: number;
  txHash?: string; // On-chain transaction hash from smart contract
}) {
  try {
    const user = await getConnectedUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const limit = getLoanLimit(user.CrediXScore);
    if (data.amount > limit) {
      return {
        success: false,
        error: `Requested amount exceeds limit of ${limit} CTC based on your credit score.`,
      };
    }

    // Calculate due date
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + data.durationMonths);

    const loan = await prisma.loan.create({
      data: {
        userId: user.id,
        amount: data.amount,
        interestRate: data.interestRate,
        dueDate,
        status: LoanStatus.ACTIVE,
        contractTxHash: data.txHash ?? null,
      },
    });

    // Bump CrediX score to simulate reputational gain
    const newScore = Math.min(100, Math.max(0, user.CrediXScore + 5));
    await prisma.user.update({
      where: { id: user.id },
      data: { CrediXScore: newScore },
    });

    return { success: true, loan };
  } catch (error: any) {
    console.error("Failed to create loan:", error);
    return { success: false, error: "Failed to create loan application" };
  }
}

export async function getUserLoansAction() {
  try {
    const user = await getConnectedUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const loans = await prisma.loan.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, loans };
  } catch (error: any) {
    console.error("Failed to fetch loans:", error);
    return { success: false, error: "Failed to fetch loans" };
  }
}

export async function repayLoanAction(
  loanId: string,
  repaymentType: "ON_TIME" | "LATE" | "DEFAULT",
) {
  try {
    const user = await getConnectedUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const loan = await prisma.loan.findUnique({
      where: { id: loanId },
    });

    if (!loan) return { success: false, error: "Loan not found" };
    if (loan.userId !== user.id)
      return { success: false, error: "Unauthorized" };
    if (loan.status !== LoanStatus.ACTIVE)
      return { success: false, error: "Loan is not active" };

    let nextStatus = LoanStatus.REPAID;
    let scoreAdjustment = 0;

    switch (repaymentType) {
      case "ON_TIME":
        nextStatus = LoanStatus.REPAID;
        scoreAdjustment = 10;
        break;
      case "LATE":
        nextStatus = LoanStatus.LATE as any;
        scoreAdjustment = -15;
        break;
      case "DEFAULT":
        nextStatus = LoanStatus.DEFAULTED as any;
        scoreAdjustment = -40;
        break;
    }

    // Calculate the new constrained score (max 100, min 0)
    const newScore = Math.min(
      100,
      Math.max(0, user.CrediXScore + scoreAdjustment),
    );

    const updatedLoan = await prisma.loan.update({
      where: { id: loanId },
      data: {
        status: nextStatus,
        repaidAmount: repaymentType === "DEFAULT" ? 0 : loan.amount, // Default records 0 repayment
        repaidAt: new Date(),
      },
    });

    // Update user's score based on their repayment history
    await prisma.user.update({
      where: { id: user.id },
      data: { CrediXScore: newScore },
    });

    return { success: true, loan: updatedLoan };
  } catch (error: any) {
    console.error("Failed to repay loan:", error);
    return { success: false, error: "Failed to process repayment" };
  }
}
