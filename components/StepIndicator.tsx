
import React from 'react';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-center space-x-4 mb-12">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-colors
                  ${isActive ? 'bg-emerald-500 text-white scale-110 ring-4 ring-emerald-200' : ''}
                  ${isCompleted ? 'bg-emerald-600 text-white' : ''}
                  ${!isActive && !isCompleted ? 'bg-gray-200 text-gray-600' : ''}
                `}
              >
                {isCompleted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>
              <p className={`mt-2 font-medium text-sm transition-colors ${isActive ? 'text-emerald-600' : 'text-gray-500'}`}>
                {step}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;