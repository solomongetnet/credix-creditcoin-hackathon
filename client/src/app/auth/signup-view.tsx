"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useSignUpWithEmailMutation } from "@/hooks/api/use-auth";
import { useRouter } from "next/navigation";

const validationSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required().min(4).max(12),
});

type FormType = yup.InferType<typeof validationSchema>;

const SignupView = () => {
  const router = useRouter();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    resolver: yupResolver(validationSchema),
  });

  // Mock mutation for demo
  const signUpMutation = useSignUpWithEmailMutation();

  const onSubmit = async (data: FormType) => {
    await signUpMutation.mutateAsync({ data });
    router.push("/");
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <Label className="text-base">Name</Label>
          <Input
            className="py-5 w-full"
            placeholder="John Doe"
            {...register("name")}
            disabled={signUpMutation.isPending}
          />
          {errors.name && (
            <p className="text-sm text-red-500 first-letter:capitalize">
              {errors.name.message}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-base">Email</Label>
          <Input
            className="py-5 w-full"
            placeholder="@gmail.com"
            {...register("email")}
            disabled={signUpMutation.isPending}
          />
          {errors.email && (
            <p className="text-sm text-red-500 first-letter:capitalize">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-base">Password</Label>
          <Input
            className="py-5 w-full"
            placeholder="******"
            type="password"
            {...register("password")}
            disabled={signUpMutation.isPending}
          />
          {errors.password && (
            <p className="text-sm text-red-500 first-letter:capitalize">
              {errors.password.message}
            </p>
          )}
        </div>
        <Button
          className="mt-1 w-full py-5"
          disabled={signUpMutation.isPending}
        >
          {signUpMutation.isPending ? "Please wait..." : "Sign up now"}
        </Button>
      </form>
    </div>
  );
};

export default SignupView;
