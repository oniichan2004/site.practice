"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { register as registerUser } from "@/api/requests";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/lib/schemas/home/register";
import { zodFormResolver } from "@/lib/zod-resolver";

interface RegisterProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function RegisterDialog({ open, setOpen }: RegisterProps) {
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodFormResolver<RegisterFormValues>(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const tokens = await registerUser(values);
      await login(tokens);
      toast.success("Account created successfully");
      reset();
      setOpen(false);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create an account</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="register-first-name" className="text-sm font-medium">
              First name
            </label>
            <Input
              id="register-first-name"
              aria-invalid={!!errors.firstName}
              {...register("firstName")}
            />
            {errors.firstName ? (
              <p className="text-sm text-destructive">
                {errors.firstName.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="register-last-name" className="text-sm font-medium">
              Last name
            </label>
            <Input
              id="register-last-name"
              aria-invalid={!!errors.lastName}
              {...register("lastName")}
            />
            {errors.lastName ? (
              <p className="text-sm text-destructive">
                {errors.lastName.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="register-phone" className="text-sm font-medium">
              Phone number
            </label>
            <Input
              id="register-phone"
              type="tel"
              aria-invalid={!!errors.phoneNumber}
              {...register("phoneNumber")}
            />
            {errors.phoneNumber ? (
              <p className="text-sm text-destructive">
                {errors.phoneNumber.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="register-email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="register-email"
              type="email"
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email ? (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="register-password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="register-password"
              type="password"
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            {errors.password ? (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            ) : null}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
