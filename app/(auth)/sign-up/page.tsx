import { SignUp } from "@clerk/nextjs";
import BackgroundRays from "~/components/ui/BackgroundRays";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-falbor-elements-background-depth-1 relative">
      <BackgroundRays />
      <div className="relative z-10 w-full max-w-md mx-4 flex justify-center">
        <SignUp routing="hash" fallbackRedirectUrl="/" />
      </div>
    </div>
  );
}
