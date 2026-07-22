import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { classNames } from '~/utils/classNames';
import { useAuth } from '~/hooks/useAuth';
import { Frown, Annoyed, Meh, Smile, Laugh } from 'lucide-react';

const STEPS = [
  {
    question: "Where did you hear about Falbor?",
    options: ["Google", "ChatGPT", "Instagram", "YouTube", "Twitter/X", "Other"],
    placeholder: "Tell us more (optional)..."
  },
  {
    question: "What do you like most about the platform so far?",
    options: ["UI/Design", "Features", "Speed/Performance", "Ease of use", "Other"],
    placeholder: "Any specific details? (optional)"
  },
  {
    question: "What features or improvements would you like to see?",
    options: ["More AI Models", "Better integrations", "Mobile App", "Collaboration tools", "Other"],
    placeholder: "Please describe what you need... (optional)"
  },
  {
    question: "How easy was it to navigate and use the site?",
    options: ["Very Easy", "Somewhat Easy", "Neutral", "Somewhat Difficult", "Very Difficult"],
    placeholder: "What was confusing? (optional)"
  },
  {
    question: "What is your primary use case for Falbor?",
    options: ["Personal projects", "Work/Professional", "Education", "Just exploring", "Other"],
    placeholder: "Tell us more about your projects... (optional)"
  },
  {
    question: "How would you rate your overall experience?",
    options: [], // Handled uniquely
    placeholder: "What are the main reasons for your rating? (optional)"
  }
];

const RATING_ICONS = [
  { value: 1, label: 'Terrible', icon: Frown },
  { value: 2, label: 'Bad', icon: Annoyed },
  { value: 3, label: 'Okay', icon: Meh },
  { value: 4, label: 'Good', icon: Smile },
  { value: 5, label: 'Amazing', icon: Laugh },
];

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showThankYou, setShowThankYou] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  // Store answers for all steps. Each step has an { option, text }
  const [answers, setAnswers] = useState<{ option: string; text: string }[]>(
    Array(STEPS.length).fill({ option: '', text: '' })
  );

  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    fetch('/api/feedback')
      .then((res) => res.json())
      .then((data) => {
        if (data.hasSubmitted) {
          setHasSubmitted(true);
        } else {
          setTimeout(() => setIsOpen(true), 2000);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  if (!user || loading || hasSubmitted) return null;

  const currentStep = STEPS[stepIndex];
  const currentAnswer = answers[stepIndex];
  const isLastStep = stepIndex === STEPS.length - 1;

  const updateAnswer = (field: 'option' | 'text', value: string) => {
    const newAnswers = [...answers];
    newAnswers[stepIndex] = { ...newAnswers[stepIndex], [field]: value };
    setAnswers(newAnswers);
  };

  const handleNext = async () => {
    if (!isLastStep) {
      setStepIndex(stepIndex + 1);
      return;
    }

    // Submit data
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          answers: answers.slice(0, -1), // Everything except rating
          rating: { value: parseInt(answers[STEPS.length - 1].option), reason: answers[STEPS.length - 1].text }
        }),
      });
    } catch (e) {
      // ignore
    }

    setShowThankYou(true);
    setTimeout(() => {
      setIsOpen(false);
      setHasSubmitted(true);
    }, 2000);
  };

  const handleBack = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
          className="fixed bottom-6 right-6 z-50 w-full max-w-[440px]"
        >
          <Card className="shadow-2xl border-falbor-elements-borderColor overflow-hidden relative group bg-falbor-elements-background">
            {isMinimized ? (
              <div
                className="p-4 cursor-pointer flex justify-between items-center bg-falbor-elements-background-depth-2 hover:bg-falbor-elements-background-depth-3 transition-colors"
                onClick={() => setIsMinimized(false)}
              >
                <span className="font-semibold text-falbor-elements-textPrimary">Share Feedback</span>
                <span className="text-xl">💬</span>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="absolute top-4 right-4 p-2 text-falbor-elements-textSecondary hover:text-falbor-elements-textPrimary z-10 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                </button>

                {showThankYou ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-8 text-center flex flex-col items-center justify-center min-h-[300px]"
                  >
                    <div className="text-5xl mb-4">🎉</div>
                    <h3 className="text-2xl font-bold text-falbor-elements-textPrimary mb-2">Thank you!</h3>
                    <p className="text-falbor-elements-textSecondary">Your feedback helps us improve Falbor.</p>
                  </motion.div>
                ) : (
                  <>
                    <CardHeader className="pb-4 pt-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-purple-500 uppercase tracking-wider">
                          Feedback ({stepIndex + 1}/{STEPS.length})
                        </span>
                      </div>
                      <CardTitle className="text-lg leading-tight font-semibold text-falbor-elements-textPrimary">
                        {currentStep.question}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="flex flex-col gap-4">
                      {/* Options Grid */}
                      {!isLastStep ? (
                        <div className="flex flex-wrap gap-2">
                          {currentStep.options.map((opt) => {
                            const isSelected = currentAnswer.option === opt;
                            return (
                              <button
                                key={opt}
                                onClick={() => updateAnswer('option', opt)}
                                className={classNames(
                                  "px-3 py-2 text-sm rounded-md border transition-all duration-200 font-medium",
                                  isSelected
                                    ? "border-purple-500 bg-purple-500/10 text-purple-500 shadow-sm"
                                    : "border-falbor-elements-borderColor text-falbor-elements-textSecondary hover:border-purple-500/40 hover:text-falbor-elements-textPrimary bg-falbor-elements-background"
                                )}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex justify-between gap-2">
                          {RATING_ICONS.map((opt) => {
                            const isSelected = currentAnswer.option === opt.value.toString();
                            return (
                              <button
                                key={opt.value}
                                onClick={() => updateAnswer('option', opt.value.toString())}
                                className={classNames(
                                  "flex flex-col items-center justify-center gap-2 p-3 flex-1 rounded-md border transition-all duration-200",
                                  isSelected
                                    ? "border-purple-500 bg-purple-500/10 text-purple-500 shadow-sm"
                                    : "border-falbor-elements-borderColor text-falbor-elements-textSecondary hover:border-purple-500/40 hover:text-falbor-elements-textPrimary bg-falbor-elements-background"
                                )}
                              >
                                <opt.icon className="w-6 h-6 stroke-[1.5]" />
                                <span className="text-xs font-medium">{opt.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Optional Text Input */}
                      <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-falbor-elements-borderColor bg-falbor-elements-background px-3 py-2 text-sm text-falbor-elements-textPrimary placeholder:text-falbor-elements-textSecondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500 disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-shadow"
                        placeholder={currentStep.placeholder}
                        value={currentAnswer.text}
                        onChange={(e) => updateAnswer('text', e.target.value)}
                      />
                    </CardContent>

                    <CardFooter className="flex justify-between gap-3 pt-2 pb-6">
                      <Button
                        variant="ghost"
                        onClick={handleBack}
                        disabled={stepIndex === 0}
                        className={classNames(
                          "px-4 py-2 text-sm font-medium transition-colors",
                          stepIndex === 0 
                            ? "opacity-0 pointer-events-none" 
                            : "text-falbor-elements-textSecondary hover:bg-falbor-elements-background-depth-2 hover:text-falbor-elements-textPrimary"
                        )}
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleNext}
                        disabled={!currentAnswer.option}
                        className={classNames(
                          "px-6 py-2 transition-all duration-200",
                          currentAnswer.option
                            ? "bg-purple-500 hover:bg-purple-600 text-white shadow-sm"
                            : "bg-falbor-elements-background-depth-3 text-falbor-elements-textSecondary cursor-not-allowed"
                        )}
                      >
                        {isLastStep ? 'Submit Feedback' : 'Next'}
                      </Button>
                    </CardFooter>
                  </>
                )}
              </div>
            )}
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
