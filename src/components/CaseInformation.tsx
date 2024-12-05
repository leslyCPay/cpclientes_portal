import React from 'react';
import { useNavigate } from 'react-router-dom';


interface Props{      
    [key: string]: any;    
}


const CaseInformation: React.FC<{arepons:Props}> = ({arepons}) => {     

    const navigate = useNavigate(); 
    const goToCaseDetails = (caseId: string) => { 
        navigate(`/detail-case/${caseId}`); 
    };    

    return (             

            <tr className="bg-tussock-300 border-b border-tussock-500">
                {Object.entries(arepons).map(([key, value]) => (        
                    <td scope="row" className="px-6 py-4 font-medium text-blue-50 whitespace-nowrap dark:text-blue-100" key={key} >{value}</td> 
                ))}
                <td className="px-6 py-4" key={arepons.case_id}>                      
                    <button key={arepons.case_id} onClick={() => goToCaseDetails(arepons.case_id)} type="button" className="w-4/5 text-white bg-tussock-500 hover:bg-tussock-600 focus:ring-4 focus:outline-none focus:ring-tussock-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-tussock-600 dark:hover:bg-tussock-700 dark:focus:ring-tussock-800">
                        See Details
                        <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                        </svg>
                    </button>                    
                </td>
            </tr>           
          
    
      ); 
   
}

export default CaseInformation;