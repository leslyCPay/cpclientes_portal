import React from 'react';

interface ProgressBarProps {
  steps: string[];
  currentStepValue: string;
  labelStep:string;
}


const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStepValue, labelStep }) => {
  const currentStep = steps.indexOf(currentStepValue);
  return ( 
    <React.Fragment>    
    
      <div className="cp-progressbar w-11/12 lg:w-4/6 mx-auto py-6 mt-5">
          <div className="h-1 flex items-center justify-between mt-10">           
            {steps.map((step, index) => (
              <React.Fragment key={index}>
            <div className={`first-line:h-1 flex ${index < currentStep ? 'bg-tussock-500' : index === currentStep ? 'bg-tussock-500' : 'bg-gray-200'}`}>
              {index <= currentStep ? (
                <div className="w-1/7 h-1 relative flex items-center justify-center">
                  <div className={`h-6 w-6 rounded-full shadow flex items-center justify-center ${index <= currentStep ? 'bg-tussock-600' : 'bg-white'}`}>                  
                    {index < currentStep && (                    
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-check" width="18" height="18" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#FFFFFF" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <path d="M5 12l5 5l10 -10" />
                      </svg>
                    )}
                  </div>                
                {index === currentStep && (
                      <React.Fragment>
                      <div className="absolute top-full mt-4 bg-white shadow-lg px-3 py-2 rounded">                        
                        <svg className="absolute top-0 -mt-1 w-full right-0 left-0" width="16px" height="8px" viewBox="0 0 16 8" version="1.1" xmlns="http://www.w3.org/2000/svg">
                            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                            <g id="Progress-Bars" transform="translate(-322.000000, -198.000000)" fill="#FFFFFF">
                                <g id="Group-4" transform="translate(310.000000, 198.000000)">
                                <polygon id="Triangle" points="20 0 28 8 12 8"></polygon>
                                </g>
                            </g>
                            </g>
                        </svg>
                        <p className="focus:outline-none text-tussock-500 text-xs font-bold">{`${labelStep}`}</p>
                      </div> 
                      <div className="absolute bg-white h-6 w-6 rounded-full shadow flex items-center justify-center -mr-1/2 ">
                          <div className="h-3 w-3 bg-tussock-500 rounded-full"></div>
                      </div>
                    </React.Fragment>
                )}  
                </div>                
              ):(
                <div className="w-1/7 h-1 relative flex items-center justify-center">
                  <div className={`h-6 w-6 rounded-full shadow flex items-center justify-center ${index <= currentStep ? 'bg-tussock-600' : 'bg-white'}`}></div>
                </div>
              )}
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 ${index < currentStep ? 'bg-tussock-500' : 'bg-gray-200'}`}></div>
            )}
            </React.Fragment>
          ))}
          </div>
        </div>
        </React.Fragment>
  );
};
export default ProgressBar;
