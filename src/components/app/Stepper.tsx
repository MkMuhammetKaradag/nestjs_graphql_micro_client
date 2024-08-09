import React, { useState } from 'react';

interface Step {
  title: string;
  buttonName: string;
  content: React.ReactElement;
  onClickSubmit: () => void;
  buttonDisable?: boolean;
}

interface StepperProps {
  steps: Step[];
}

const Stepper: React.FC<StepperProps> = ({ steps }) => {
  const [currentStep, setCurrentStep] = useState(0);
  // console.log(steps);
  const handleNext = () => {
    try {
      steps[currentStep].onClickSubmit();
      setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
    } catch (error) {
      console.log(error);
    }
  };

  //   const handlePrev = () => {
  //     setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  //   };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex justify-between mb-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex items-center ${
              index <= currentStep ? 'text-red-600' : 'text-gray-400'
            }`}
          >
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                index <= currentStep ? 'bg-red-600 text-white' : 'bg-gray-200'
              }`}
            >
              {index + 1}
            </div>
            <span className="ml-2 text-sm">{step.title}</span>
            {index < steps.length - 1 && (
              <div
                className={`flex-grow h-0.5 mx-2 ${
                  index < currentStep ? 'bg-red-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-4">
        <h2 className="text-xl font-bold mb-2">{steps[currentStep].title}</h2>
        <div>{steps[currentStep].content}</div>
      </div>
      <div className="flex justify-between">
        <button
          onClick={handleNext}
          disabled={steps[currentStep].buttonDisable}
          className={`px-4 py-2 rounded ${
            steps[currentStep].buttonDisable
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-red-500 text-white hover:bg-red-600'
          }`}
        >
          {steps[currentStep].buttonName}
        </button>
      </div>
    </div>
  );
};

export default Stepper;
