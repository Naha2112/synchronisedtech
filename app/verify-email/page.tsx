"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function verify() {
      if (!token) {
        setStatus("error");
        setMessage("Missing verification token.");
        return;
      }
      const res = await fetch(`/api/auth/verify-email?token=${token}`);
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setMessage("Your email has been verified! You can now log in.");
      } else {
        setStatus("error");
        setMessage(data.message || "Verification failed.");
      }
    }
    verify();
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          {status === "pending" && <p>Verifying your email...</p>}
          {status !== "pending" && <p>{message}</p>}
          {status === "success" && (
            <Button asChild className="mt-4 w-full">
              <Link href="/login">Go to Login</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 