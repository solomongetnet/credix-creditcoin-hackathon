"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useOnboardUserMutation } from "@/hooks/api/use-user";
import { Loader2 } from "lucide-react";

export default function OnboardingPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    upworkUrl: "",
    portfolioUrl: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // If wallet isn't connected, we shouldn't really be here, but we can handle it gently
  if (!isConnected || !address) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-bold mb-4">Wallet Not Connected</h2>
        <Button onClick={() => router.push("/login")}>Go Back to Login</Button>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const { mutateAsync: onboardUser } = useOnboardUserMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await onboardUser({
        walletAddress: address,
        ...formData,
      });

      if (result.success) {
        toast.success("Profile created successfully!");
        router.push("/dashboard");
      } else {
        toast.error(result.error || "Failed to create profile");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-card border border-border p-8 rounded-lg">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-foreground">
            Complete Your Profile
          </h2>
          <p className="mt-2 text-sm text-foreground/70">
            Tell us a bit about yourself to start building your CrediX score.
          </p>
          <div className="mt-4 p-2 bg-primary/10 rounded-md text-xs text-primary max-w-xs mx-auto truncate">
            Connected: {address}
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Full Name *
              </label>
              <Input
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Username *
              </label>
              <Input
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="johndoe123"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Email Address
              </label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com (Optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Upwork Profile URL
              </label>
              <Input
                name="upworkUrl"
                type="url"
                value={formData.upworkUrl}
                onChange={handleChange}
                placeholder="https://www.upwork.com/freelancers/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Portfolio or Website
              </label>
              <Input
                name="portfolioUrl"
                type="url"
                value={formData.portfolioUrl}
                onChange={handleChange}
                placeholder="https://myportfolio.com"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Complete Profile"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
