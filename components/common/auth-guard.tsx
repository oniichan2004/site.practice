"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { LockKeyhole } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "@/i18n/navigation";

const REDIRECT_DELAY_MS = 2500;

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Gates its children behind authentication. While the session is being
 * restored it shows a lightweight loading state; if the user is not
 * authenticated it shows a blocking modal and redirects to the home page.
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const t = useTranslations("authGuard");

  const isBlocked = !isLoading && !isAuthenticated;

  useEffect(() => {
    if (!isBlocked) return;
    const timer = setTimeout(() => router.replace("/"), REDIRECT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isBlocked, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">{t("checking")}</p>
      </div>
    );
  }

  if (isBlocked) {
    return (
      <Dialog open>
        <DialogContent showCloseButton={false} className="sm:max-w-md">
          <DialogHeader className="items-center text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
              <LockKeyhole className="size-6 text-destructive" />
            </div>
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogDescription>{t("description")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => router.replace("/")}>{t("goHome")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return <>{children}</>;
}
