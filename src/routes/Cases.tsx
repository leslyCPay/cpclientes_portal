import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CaseInformation from '../components/CaseInformation';
import { useLocation } from 'react-router-dom';
import Loader from '../components/Loader';
import BASE_URL from '../config'; // Import the base URL
// Definimos los tipos para los datos que esperamos de la API
interface ApiResponse {  
  id: number;
  case_id: string;
  case_number: string;
  claim_number: string;
};

interface NameResponse { 
  names: string[]; 
};

// Define types for successful and failed responses 
interface SuccessfulResponse { 
  data: ApiResponse[];
} 

interface FailedResponse { 
  error: any; 
  name: string; 
} 

type Response = SuccessfulResponse | FailedResponse;


const Cases: React.FC= () => {
  const [data, setData] = useState<ApiResponse[]>([]); 
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const { email } = location.state || {};

  const isFailedResponse = (response: Response): response is FailedResponse => { 
    return 'error' in response; 
  };


  // Función que maneja la solicitud a la API
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {

      // First API call to get names using the email 
      const nameResponse = await axios.get<NameResponse>(`${BASE_URL}/api/emailInsured?email=${email}`, {
         headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` } 
      }); 
      
      const names = nameResponse.data; 

      if (!Array.isArray(names)) { 
        throw new Error('Expected an array of names'); 
      }

      const requests = names.map((name) => { 
        const url = `${BASE_URL}/api/cases?names=${name}`;
        return axios.get<ApiResponse[]>(url, { 
          headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }, 
        })
        .then(response => ({ 
          data: response.data 
        }))
        .catch(error => ({ 
          error, name
        }));

      }); 
      const responses = await Promise.all(requests); 
   
      const successfulResponses = responses.filter((response): response is SuccessfulResponse => !isFailedResponse(response)); 
      const allData = successfulResponses.flatMap(response => Object.values(response.data)); 
      setData(allData);
      const failedResponses = responses.filter(isFailedResponse); 
      if (failedResponses.length) { 
        //setError(`Failed to fetch data for names: ${failedResponses.map(fr => fr.name).join(', ')}`);
      }
      

    } catch (error) {
      console.error('Error fetching cases:', error); 
      setError('Failed to fetch cases.');
    }finally{
      setLoading(false);
    }

  };

  useEffect(()=>{
    fetchData();
  },[]);
  
  return (
    
    
    <div className='cases-list bg-amber-100 flex min-h-screen'  >  
       <section className="container mx-auto p-6 font-questrial min-h-full">
        <h2 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5md lg:text-6md dark:text-white">List of <span className="underline underline-offset-3 decoration-8 decoration-tussock-400 dark:decoration-tussock-600">Cases</span></h2>
        {/* <p className="text-md font-normal text-gray-500 lg:text-md dark:text-gray-400 mb-5">All of these cases are with us.</p> */}
        <div>         
          {error && <p>{error}</p>}
        </div>
        {loading ? (<Loader />):(
             <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg mt-10" >
             <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
               <table className="w-full text-sm text-left rtl:text-right text-blue-100 dark:text-blue-100">
                 <thead className="text-xs text-white uppercase bg-tussock-500 dark:text-white">
                     <tr>
                         <th scope="col" className="px-6 py-3">
                             Case ID
                         </th>
                         <th scope="col" className="px-6 py-3">
                             Claim Number
                         </th>
                         <th scope="col" className="px-6 py-3">
                             Case Status
                         </th>
                         <th scope="col" className="px-6 py-3">
                             Action
                         </th>
                     </tr>
                 </thead>
                 <tbody>
                       {data.map((item)=>(
                         <CaseInformation key={item.case_id}  arepons={item} />
                       ))}            
                 </tbody>                
               </table>
             </div>
         </div>
        )}
      </section>
    </div>
  );
};

export default Cases;





