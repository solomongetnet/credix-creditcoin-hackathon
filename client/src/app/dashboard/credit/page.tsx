"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Zap,
  Loader2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useGetUserProfileQuery } from "@/hooks/api/use-user";

const creditHistoryData = [
  { month: "Jun 2023", score: 30 },
  { month: "Sep 2023", score: 40 },
  { month: "Dec 2023", score: 45 },
  { month: "Mar 2024", score: 50 },
  { month: "Jun 2024", score: 60 },
];

const creditFactors = [
  { factor: "Payment History", weight: 45, status: "excellent", value: 95 },
  { factor: "Verified Projects", weight: 35, status: "good", value: 82 },
  { factor: "Platform Age", weight: 20, status: "good", value: 65 },
];

const recommendations = [
  {
    title: "Complete More Verified Projects",
    description:
      "On-chain verifications and successfully completed projects carry high weight in CrediX scoring.",
    impact: "+20 pts potential",
    priority: "high",
  },
  {
    title: "Repay Loans Early or On-Time",
    description:
      "Consistent timely repayments show reliability. Late payments deduct 15 points instantly.",
    impact: "Varies",
    priority: "medium",
  },
  {
    title: "Maintain Platform Activity",
    description:
      "Just staying active and avoiding default statuses maintains the baseline score health.",
    impact: "+5 pts potential",
    priority: "low",
  },
];

export default function CreditPage() {
  const { data: profileData, isLoading } = useGetUserProfileQuery();

  if (isLoading) {
    return (
      <div className="p-12 text-center text-foreground/70">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p>Loading your credit profile...</p>
      </div>
    );
  }

  const user = profileData?.user;
  const creditScore = user?.CrediXScore ?? 0;

  const scoreRange = { min: 0, max: 100 };
  const scorePercentage = (creditScore / scoreRange.max) * 100;

  const getScoreRating = (score: number) => {
    if (score >= 80)
      return { label: "Excellent", color: "text-muted-foreground" };
    if (score >= 60) return { label: "Good", color: "text-primary" };
    if (score >= 31) return { label: "Fair", color: "text-amber-500" };
    return { label: "Poor", color: "text-destructive" };
  };

  const rating = getScoreRating(creditScore);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground">Credit Score</h1>
        <p className="text-foreground/70 mt-2">
          Understand and improve your CrediX creditworthiness
        </p>
      </div>

      {/* Main Credit Score Card */}
      <Card className="bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 p-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-foreground/70 mb-4">Your Current CrediX Score</p>
            <div className="flex items-baseline gap-4">
              <div className="text-7xl font-bold text-foreground">
                {creditScore}
              </div>
              <div>
                <p className={`text-xl font-semibold ${rating.color}`}>
                  {rating.label}
                </p>
              </div>
            </div>
            <p className="text-sm text-foreground/60 mt-4">
              Range: {scoreRange.min} - {scoreRange.max} (0-100 tier bounds
              applied)
            </p>
          </div>

          {/* Score Meter */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-foreground/60">Poor (0)</span>
              <span className="text-xs text-foreground/60">
                Excellent (100)
              </span>
            </div>
            <div className="h-3 bg-gradient-to-r from-destructive via-amber-500 to-accent rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-white/80 rounded-full transition-all"
                style={{
                  width: "20px",
                  marginLeft: `calc(${scorePercentage}% - 10px)`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </Card>

      {/* Score Trend */}
      <Card className="bg-card border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Simulated Score History
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={creditHistoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="month"
              stroke="var(--foreground)"
              opacity={0.5}
              angle={-45}
              height={80}
            />
            <YAxis stroke="var(--foreground)" opacity={0.5} domain={[0, 100]} />
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
              strokeWidth={3}
              dot={{ fill: "var(--accent)", r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Recommendations */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          Improve Your Score
        </h3>
        {recommendations.map((rec, idx) => {
          const priorityStyles = {
            high: "border-destructive/30 bg-destructive/5",
            medium: "border-amber-500/30 bg-amber-500/5",
            low: "border-primary/30 bg-primary/5",
          };

          return (
            <Card
              key={idx}
              className={`border p-6 ${priorityStyles[rec.priority as keyof typeof priorityStyles]}`}
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  {rec.priority === "high" && (
                    <AlertCircle className="w-6 h-6 text-destructive mt-1" />
                  )}
                  {rec.priority === "medium" && (
                    <Zap className="w-6 h-6 text-amber-600 mt-1" />
                  )}
                  {rec.priority === "low" && (
                    <CheckCircle2 className="w-6 h-6 text-primary mt-1" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">
                    {rec.title}
                  </h4>
                  <p className="text-sm text-foreground mb-3">
                    {rec.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Potential Impact: {rec.impact}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
