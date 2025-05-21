
import React, { useRef } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const verifySchema = z.object({
  otp: z.string().min(6, "Please enter a valid verification code"),
});

type VerifyValues = z.infer<typeof verifySchema>;

const Verify: React.FC = () => {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  
  const form = useForm<VerifyValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = (data: VerifyValues) => {
    console.log("OTP verification data:", data);
    toast({
      title: "Verification Successful",
      description: "Your account has been verified successfully",
    });
    // Here we would normally call an API endpoint to verify the OTP
    // Then redirect to the login page or dashboard
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
  };

  const resendOTP = () => {
    toast({
      title: "Verification Code Resent",
      description: "A new verification code has been sent to your email",
    });
  };

  return (
    <AuthLayout
      title="Verify your account"
      description="We've sent a verification code to your email"
    >
      <Form {...form}>
        <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    value={field.value}
                    onChange={field.onChange}
                    render={({ slots }) => (
                      <InputOTPGroup>
                        {slots.map((slot, i) => (
                          <InputOTPSlot key={i} {...slot} index={i} />
                        ))}
                      </InputOTPGroup>
                    )}
                  />
                </FormControl>
                <FormDescription className="text-center text-xs">
                  Please enter the 6-digit code sent to your email
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full">
            Verify Account
          </Button>
        </form>
      </Form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Didn't receive a code?
        </p>
        <Button variant="link" onClick={resendOTP} className="text-primary">
          Resend verification code
        </Button>
      </div>
    </AuthLayout>
  );
};

export default Verify;
