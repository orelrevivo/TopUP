import DefaultDemo from "~/components/landing/Navbar"
import { LandingScrollHandler } from "~/components/landing/landing-scroll-handler"
import { ThemeHandler } from "~/components/landing/ThemeHandler"

export default function PrivacyAndTerms() {
  return (
    <div className="w-full flex flex-col relative min-h-screen bg-white text-zinc-900">
      <ThemeHandler force="light" />
      <LandingScrollHandler />

      {/* Global Sticky Navbar */}
      <div className="sticky top-0 left-0 right-0 w-full z-[100] bg-white/80 backdrop-blur-md">
        <DefaultDemo />
      </div>
      <div className="sticky top-0 w-full flex flex-col items-center justify-center z-10 overflow-hidden">
        <div className="relative z-10 w-full max-w-5xl px-20 flex flex-col items-center justify-center border-l border-r border-zinc-200 h-full">
          <div className="relative top-10">
            <h1
              className="text-4xl font-bold mb-8 text-center text-zinc-900 px-4 md:px-8"
              style={{
                fontFamily: '"Google Sans", sans-serif',
                fontOpticalSizing: "auto",
                fontVariationSettings: '"GRAD" 0',
              }}
            >
              Privacy Policy & <span className="text-[#D97A55]">Terms of Service</span>
            </h1>
            <div className="space-y-8 text-zinc-700 leading-relaxed px-4 md:px-8">
              <section>
                <h2 className="text-2xl font-semibold text-zinc-900 mb-4">1. Data Collection & Privacy</h2>
                <p>
                  We use well-known AI models to power our services. When you interact with our chat, your data and chat usage are sent to our servers and processed through the APIs of these AI models. We save chat usage on our servers, and our team has access to this data. We review it to identify problems, address unpleasant interactions, gather feedback, and continuously improve our system. We strive to keep your data as private as possible while ensuring the quality of our product.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-zinc-900 mb-4">2. Product Status</h2>
                <p>
                  Our product is currently in beta. We are continuously working to improve and finalize all features. You may encounter occasional issues or unexpected behavior as we actively develop and refine the platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-zinc-900 mb-4">3. Subscriptions & Credits</h2>
                <p>
                  Every user receives $1 in free credits every month. All credits are reset on a monthly basis. Before purchasing a subscription, please carefully review the features and credits included in that tier.
                  All purchases on the site require immediate payment. We do not support deferred billing or payments "a month later."
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-zinc-900 mb-4">4. User Responsibilities & Acceptable Use</h2>
                <p>
                  Users are expected to use the platform responsibly. Any abuse of the AI models, malicious behavior, or attempts to exploit the platform's infrastructure are strictly prohibited and may result in the immediate termination of your account. We reserve the right to monitor usage to prevent abuse and ensure a safe environment for all users.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-zinc-900 mb-4">5. Disclaimer of Warranties</h2>
                <p>
                  The service is provided "as is" and "as available" without any warranties of any kind, either express or implied. Because the product is in beta, we do not guarantee uninterrupted, secure, or error-free operation.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-zinc-900 mb-4">6. Contact & Support</h2>
                <p>
                  If you encounter any problems, need assistance, or have questions about these terms, please contact our support team at <a href="mailto:falbor@gmail.com" className="text-blue-600 hover:underline">falbor@gmail.com</a>.
                </p>
              </section>

              <p className="text-sm text-zinc-500 pt-8 mt-8 border-t border-zinc-100">
                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
