"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Mail,
  Wallet,
  Globe,
  Briefcase,
  Save,
  Edit2,
  AtSign,
  TrendingUp,
  Calendar,
  FileText,
  X,
} from "lucide-react";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from "@/hooks/api/use-user";
import { formatCTC } from "@/lib/utils/currency";

/* ─── helpers ─────────────────────────────────────────── */

function Field({
  label,
  icon: Icon,
  value,
  name,
  type = "text",
  placeholder,
  isEditing,
  readOnly,
  onChange,
}: {
  label: string;
  icon: React.ElementType;
  value: string;
  name: string;
  type?: string;
  placeholder?: string;
  isEditing: boolean;
  readOnly?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="w-full">
      <label className="flex w-full items-center gap-2 text-sm font-medium text-foreground mb-2">
        <Icon className="w-4 h-4 text-primary/70" />
        {label}
        {readOnly && (
          <span className="text-[10px] bg-muted/60 text-foreground/50 px-2 py-0.5 rounded-full uppercase tracking-wide">
            Read-only
          </span>
        )}
      </label>
      {isEditing && !readOnly ? (
        <Input
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className="w-full bg-background"
        />
      ) : (
        <div className="p-3 rounded-lg bg-muted/30 border border-border text-foreground text-sm truncate">
          {value || <span className="text-foreground/40 italic">Not set</span>}
        </div>
      )}
    </div>
  );
}

/* ─── score ring ─────────────────────────────────────── */

function ScoreRing({ score }: { score: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;

  const color =
    score > 80
      ? "#22c55e"
      : score > 60
        ? "#3b82f6"
        : score >= 31
          ? "#f59e0b"
          : "#ef4444";

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg
        width="128"
        height="128"
        viewBox="0 0 128 128"
        className="-rotate-90 absolute inset-0"
      >
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth="10"
        />
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
      </svg>
      <div className="relative text-center">
        <p className="text-3xl font-extrabold text-foreground leading-none">
          {score}
        </p>
        <p className="text-[10px] text-foreground/50 uppercase tracking-wide mt-0.5">
          / 100
        </p>
      </div>
    </div>
  );
}

/* ─── page ─────────────────────────────────────────────── */

export default function ProfilePage() {
  const { data: profileData, isLoading } = useGetUserProfileQuery();
  const updateMutation = useUpdateUserProfileMutation();

  const user = profileData?.user as any;

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    upworkUrl: "",
    portfolioUrl: "",
  });

  // Sync form whenever user data loads
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? "",
        email: user.email ?? "",
        upworkUrl: user.upworkUrl ?? "",
        portfolioUrl: user.portfolioUrl ?? "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateMutation.mutate(form, {
      onSuccess: (result) => {
        if (result.success) {
          setIsEditing(false);
        }
      },
    });
  };

  const handleCancel = () => {
    if (user) {
      setForm({
        name: user.name ?? "",
        email: user.email ?? "",
        upworkUrl: user.upworkUrl ?? "",
        portfolioUrl: user.portfolioUrl ?? "",
      });
    }
    setIsEditing(false);
  };

  /* ── loading skeleton ── */
  if (isLoading) {
    return (
      <div className="space-y-8 max-w-4xl opacity-50 pointer-events-none">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const creditScore = user?.CrediXScore ?? 0;
  const loanCount = user?.loans?.length ?? 0;
  const activeLoans =
    user?.loans?.filter((l: any) => l.status === "ACTIVE").length ?? 0;
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div className="space-y-8 max-w-full">
      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Profile</h1>
          <p className="text-foreground/60 mt-1 text-sm">
            Manage your freelance account information
          </p>
        </div>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              <Save className="w-4 h-4 mr-2" />
              {updateMutation.isPending ? "Saving…" : "Save Changes"}
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Credit Score",
            value: `${creditScore}/100`,
            sub:
              creditScore > 80
                ? "Excellent"
                : creditScore > 60
                  ? "Good"
                  : creditScore >= 31
                    ? "Fair"
                    : "Poor",
            icon: TrendingUp,
          },
          {
            label: "Member Since",
            value: memberSince,
            sub: "Account age",
            icon: Calendar,
          },
          {
            label: "Total Loans",
            value: String(loanCount),
            sub: `${activeLoans} active`,
            icon: FileText,
          },
          {
            label: "Loan Limit",
            value: `${creditScore >= 81 ? "500" : creditScore >= 61 ? "200" : creditScore >= 31 ? "100" : "0"} CTC`,
            sub: "Based on score",
            icon: Briefcase,
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="bg-card border border-border p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs text-foreground/50 uppercase tracking-wide">
                  {stat.label}
                </p>
                <Icon className="w-4 h-4 text-primary/60" />
              </div>
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-foreground/50 mt-0.5">{stat.sub}</p>
            </Card>
          );
        })}
      </div>

      {/* ── Main two-column layout ── */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left: credit score ring + avatar area */}
        <Card className="bg-card border border-border p-6 flex flex-col items-center gap-4">
          {/* Avatar placeholder */}
          <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
            <User className="w-9 h-9 text-primary/60" />
          </div>
          <div className="text-center">
            <p className="font-bold text-foreground text-lg">
              {user?.name || "—"}
            </p>
            {user?.username && (
              <p className="text-sm text-foreground/50">@{user.username}</p>
            )}
          </div>

          <div className="w-full border-t border-border pt-4 flex flex-col items-center gap-2">
            <p className="text-xs text-foreground/50 uppercase tracking-wide">
              CrediX Score
            </p>
            <ScoreRing score={creditScore} />
            <p className="text-xs text-foreground/50">
              {creditScore > 80
                ? "Excellent standing"
                : creditScore > 60
                  ? "Good standing"
                  : creditScore >= 31
                    ? "Fair standing"
                    : "Build your score"}
            </p>
          </div>

          {/* Wallet address */}
          <div className="w-full border-t border-border pt-4">
            <p className="text-xs text-foreground/50 uppercase tracking-wide mb-1 flex items-center gap-1">
              <Wallet className="w-3 h-3" /> Wallet
            </p>
            <p className="text-xs text-foreground/80 font-mono break-all">
              {user?.walletAddress
                ? `${user.walletAddress.slice(0, 8)}…${user.walletAddress.slice(-6)}`
                : "—"}
            </p>
          </div>
        </Card>

        {/* Right: editable fields */}
        <Card className="bg-card border border-border p-6 md:col-span-2">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Account Information
          </h3>

          <div className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <Field
                label="Full Name"
                icon={User}
                name="name"
                value={form.name}
                isEditing={isEditing}
                placeholder="Your full name"
                onChange={handleChange}
              />
              <Field
                label="Username"
                icon={AtSign}
                name="username"
                value={user?.username ?? ""}
                isEditing={isEditing}
                readOnly
                onChange={handleChange}
              />
            </div>

            <Field
              label="Email Address"
              icon={Mail}
              name="email"
              type="email"
              value={form.email}
              isEditing={isEditing}
              placeholder="you@example.com"
              onChange={handleChange}
            />

            <Field
              label="Wallet Address"
              icon={Wallet}
              name="walletAddress"
              value={user?.walletAddress ?? ""}
              isEditing={isEditing}
              readOnly
              onChange={handleChange}
            />

            <div className="grid md:grid-cols-2 gap-5">
              <Field
                label="Upwork Profile"
                icon={Briefcase}
                name="upworkUrl"
                type="url"
                value={form.upworkUrl}
                isEditing={isEditing}
                placeholder="https://upwork.com/freelancers/…"
                onChange={handleChange}
              />
              <Field
                label="Portfolio / Website"
                icon={Globe}
                name="portfolioUrl"
                type="url"
                value={form.portfolioUrl}
                isEditing={isEditing}
                placeholder="https://yourportfolio.com"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* inline save bar while editing */}
          {isEditing && (
            <div className="flex gap-3 mt-8 pt-6 border-t border-border">
              <Button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="bg-primary hover:bg-primary/90 text-white flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {updateMutation.isPending ? "Saving…" : "Save Changes"}
              </Button>
              <Button variant="outline" onClick={handleCancel} className="flex-1">
                Cancel
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
