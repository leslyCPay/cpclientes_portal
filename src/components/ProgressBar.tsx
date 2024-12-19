import React from 'react';

interface ProgressBarProps {
  steps: string[];
  currentStepValue: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStepValue }) => {
  const currentStep = steps.indexOf(currentStepValue);

  return (

        <div className="cp-progressbar w-11/12 lg:w-4/6 mx-auto py-16 mb-15">
          <div className="bg-gray-200 h-1 flex items-center justify-between">

            {steps.map((step, index) => (
              <div key={index} className={`w-1/7  h-1 flex items-center ${index <= currentStep ? 'bg-tussock-500' : 'bg-white'} relative`}>

                  {index === currentStep && (
                      <React.Fragment>
                        <div className="absolute right-0 -mr-8">
                            <div className="relative bg-white shadow-lg px-3 py-2 rounded mt-20 mr-2">
                              <svg className="absolute top-0 -mt-1 w-full right-0 left-0" width="16px" height="8px" viewBox="0 0 16 8" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                  <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                  <g id="Progress-Bars" transform="translate(-322.000000, -198.000000)" fill="#FFFFFF">
                                      <g id="Group-4" transform="translate(310.000000, 198.000000)">
                                      <polygon id="Triangle" points="20 0 28 8 12 8"></polygon>
                                      </g>
                                  </g>
                                  </g>
                              </svg>
                              <p className="focus:outline-none text-tussock-500 text-xs font-bold">{`Stage ${index + 1}: ${step}`}</p>
                            </div>
                            
                        </div>
                    {/*     <div className="bg-tussock-500 h-6 w-6 rounded-full shadow flex items-center justify-center -ml-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-check" width="18" height="18" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#FFFFFF" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" />
                                <path d="M5 12l5 5l10 -10" />
                            </svg>
                        </div> */}
                        <div className="bg-white h-6 w-6 rounded-full shadow flex items-center justify-center -mr-6 relative">
                            <div className="h-3 w-3 bg-tussock-500 rounded-full"></div>
                        </div>
                    </React.Fragment>
                    )}





                <div className={`h-6 w-6 rounded-full shadow flex items-center justify-center ${index <= currentStep ? 'bg-tussock-600' : 'bg-white'}`}>
                  {index < currentStep ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-check" width="18" height="18" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#FFFFFF" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" />
                      <path d="M5 12l5 5l10 -10" />
                    </svg>
                  ) : index === currentStep ? (
                    <div className="h-3 w-3 bg-tussock-600 rounded-full"></div>
                  ) : null}
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 ${index < currentStep ? 'bg-tussock-500' : 'bg-gray-200'}`}></div>
                )}

                {/* <div className={`w-1/7 flex justify-between bg-tussock-500 h-1 items-center relative`}> */}
                 
                    
                {/* </div> */}
                    


              </div>
            ))}
            
          </div>
        </div>

  );
};

export default ProgressBar;
