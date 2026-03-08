import loanPoolAbi from "@/../contracts/loan-pool.abi.json";
import coinAbi from "@/../contracts/coin.abi.json";

export const LOAN_POOL_ADDRESS =
  (process.env.NEXT_PUBLIC_LOAN_POOL_ADDRESS as `0x${string}`) ||
  "0x2e234DAe75C793f67A35089C9d99245E1C58470b";

export const CCTC_ADDRESS =
  (process.env.NEXT_PUBLIC_CCTC_ADDRESS as `0x${string}`) ||
  "0x5352E4bc9Eaf5b86ea0cfE29a6741CA087dB4C32";

export { loanPoolAbi, coinAbi };
