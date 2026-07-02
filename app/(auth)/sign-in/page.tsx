import { SignIn } from "@clerk/nextjs";
import BackgroundRays from "~/components/ui/BackgroundRays";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-falbor-elements-background-depth-1 relative">
      <BackgroundRays />
      <div className="relative z-10 w-full max-w-md mx-4 flex justify-center">
        <SignIn routing="hash" fallbackRedirectUrl="/" />
      </div>
    </div>
  );
}
