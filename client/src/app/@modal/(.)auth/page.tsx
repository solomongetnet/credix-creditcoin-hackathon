"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import LoginView from "./login-view";
import SignupView from "./signup-view";

export default function AuthModaPagel() {
  const [currentView, setCurrentView] = useState<"login" | "signup">("login");
  const router = useRouter();
  const onClose = () => router.back();

  return (
    <>
      {true && (
        <div
          className="fixed inset-0 z-40 bg-white/10 backdrop-blur-sm transition-all duration-300"
          onClick={onClose}
        />
      )}

    <Dialog open={true} onOpenChange={(open) => !open && onClose?.()}>
      <DialogContent className="sm:max-w-md border-0 shadow-2xl">
        <div className="space-y-5">
          {/* header */}
          {currentView === "login" ? (
            <DialogHeader className="text-center pb-2">
              <DialogTitle className="text-2xl font-bold tracking-tight">
                Welcome back
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                Sign in to your account to continue
              </DialogDescription>
            </DialogHeader>
          ) : (
            <DialogHeader className="text-center pb-2">
              <DialogTitle className="text-2xl font-bold tracking-tight">
                Register now
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                Create your new account to continue
              </DialogDescription>
            </DialogHeader>
          )}

          {/* main view */}
          {currentView === "login" ? <LoginView /> : <SignupView />}

          {/* footer */}
          <div className="flex flex-col gap-2 justify-center">
            {currentView === "login" ? (
              <div className="text-center text-sm text-muted-foreground pt-4 border-t">
                {"Don't have an account? "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-sm font-semibold text-primary"
                  onClick={() => setCurrentView("signup")}
                >
                  Sign up
                </Button>
              </div>
            ) : (
              <div className="text-center text-sm text-muted-foreground pt-4 border-t">
                {"Already have an account? "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-sm font-semibold text-primary"
                  onClick={() => setCurrentView("login")}
                >
                  Log in
                </Button>
              </div>
            )}
            <span className=" text-xs text-center text-foreground/45 w-full ">
              Powered by{" "}
              <span className="underline underline-offset-2 cursor-pointer">
                Better-auth
              </span>{" "}
              <span>❤</span>
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
