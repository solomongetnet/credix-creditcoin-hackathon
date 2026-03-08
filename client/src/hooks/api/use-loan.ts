import {
  createLoanAction,
  getUserLoansAction,
  repayLoanAction,
} from "@/actions/loan.actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loan } from "@/generated/prisma";

export const useCreateLoanMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { amount: number; interestRate: number; durationMonths: number; txHash?: string }) =>
      createLoanAction(data),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["user_loans"] });
        queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        toast.success("Loan application instantly approved for testing!");
      } else {
        toast.error(result.error);
      }
    },
    onError: () => {
      toast.error("Failed to apply for loan");
    },
  });
};

export const useGetUserLoansQuery = () => {
  return useQuery({
    queryKey: ["user_loans"],
    queryFn: async () => {
      const res = await getUserLoansAction();
      if (!res.success) throw new Error(res.error);
      return res.loans as Loan[]; // Using Prisma Loan type
    },
  });
};

export const useRepayLoanMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ loanId, type }: { loanId: string; type: "ON_TIME" | "LATE" | "DEFAULT" }) => repayLoanAction(loanId, type),
    onSuccess: (result, variables) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["user_loans"] });
        queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        
        let message = "Loan repaid successfully! (+10 Score)";
        if (variables.type === "LATE") message = "Loan repaid late. (-15 Score)";
        if (variables.type === "DEFAULT") message = "Loan defaulted. (-40 Score)";
        
        toast.success(message);
      } else {
        toast.error(result.error);
      }
    },
    onError: () => {
      toast.error("Failed to process loan repayment");
    },
  });
};
