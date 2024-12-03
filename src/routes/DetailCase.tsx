import React, { useEffect, useState } from 'react'; 
import { useParams } from 'react-router-dom'; 
import axios from 'axios';



const DetailCase: React.FC = () => {
    const { caseId } = useParams<{ caseId: string }>(); 
    const [caseDetails, setCaseDetails] = useState<any>(null);
    
    useEffect(() => { 
        const fetchCaseDetails = async () => { 
            try { 
                const response = await axios.get(`/api/details?case_id=${caseId}`); 
                setCaseDetails(response.data); 
            } catch (error) { console.error('Error fetching case details:', error); 

            } }; fetchCaseDetails(); 
        }, [caseId]);
    
    console.log(caseDetails);
    return(
        <div className="flex flex-col justify-center items-center h-[100vh]">
            <div className="relative flex flex-col items-center rounded-[20px] w-[700px] max-w-[95%] mx-auto bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:!shadow-none p-3">
                {caseDetails? (
                <div className="grid grid-cols-2 gap-4 px-2 w-full">
                    {Object.keys(caseDetails).map((key, index) => (                        
                        <div key={index} className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
                            <p className="text-sm text-gray-600">{key}</p>
                            <p className="text-base font-medium text-navy-700 dark:text-white">
                                 {caseDetails[key]}
                            </p>
                        </div>
                    ))}
                    
                </div>
                ): ( <p>Loading...</p> )}
            </div>  
        </div>

    );

}


export default DetailCase;