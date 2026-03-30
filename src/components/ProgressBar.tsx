import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";

interface ProgressBarProps {
  steps: string[];
  currentStepValue: string;
  labelStep: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  steps,
  currentStepValue,
  labelStep,
}) => {
  const [animatedStep, setAnimatedStep] = useState<number>(-1);
  const currentStep = steps.indexOf(currentStepValue);

  useEffect(() => {
    // Reset the animation when the currentStep changes
    setAnimatedStep(-1);

    // Animate the progress bar step by step
    const interval = setInterval(() => {
      setAnimatedStep((prev) => {
        if (prev < currentStep) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 300);

    return () => clearInterval(interval);
  }, [currentStep]);

  // Width % of the filled progress line
  const progressPercent =
    animatedStep <= 0 ? 0 : (animatedStep / (steps.length - 1)) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
      <div className="relative">
        {/* Background track */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200">
          {/* Animated fill */}
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step nodes */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < animatedStep;
            const isActive = index === animatedStep;
            const isPending = index > animatedStep;

            return (
              <div
                key={index}
                className="flex flex-col items-center"
                style={{ flex: 1 }}
              >
                {/* Circle */}
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center mb-3
                    shadow-md transition-all duration-500 ease-in-out
                    ${
                      isActive
                        ? "bg-gradient-to-br from-amber-500 to-amber-600 text-white scale-110 ring-4 ring-amber-200"
                        : ""
                    }
                    ${
                      isCompleted
                        ? "bg-gradient-to-br from-green-500 to-green-600 text-white"
                        : ""
                    }
                    ${
                      isPending
                        ? "bg-white border-2 border-gray-300 text-gray-400"
                        : ""
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <span className="font-semibold text-sm">{index + 1}</span>
                  )}
                </div>

                {/* Label */}
                <div
                  className={`
                    text-center text-xs font-medium px-2 py-1 rounded-md max-w-24
                    ${isActive ? "text-amber-700 bg-amber-100" : ""}
                    ${isCompleted ? "text-green-700 bg-green-50" : ""}
                    ${isPending ? "text-gray-500" : ""}
                  `}
                >
                  {step}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
