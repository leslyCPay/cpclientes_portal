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
            <tr className="text-gray-700" >
                {Object.entries(arepons).map(([key, value]) => (        
                    <td className="px-4 py-3 border" key={key} >{value}</td> 
                ))}
                <td className="px-4 py-3 border" key={arepons.case_id}>                
                    <button key={arepons.case_id} onClick={() => goToCaseDetails(arepons.case_id)}>Get Datails</button>                    
                </td>
            </tr>
            
          
    
      ); 
   
}

export default CaseInformation;