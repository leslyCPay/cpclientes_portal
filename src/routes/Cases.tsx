import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CaseInformation from '../components/CaseInformation';
import { useLocation } from 'react-router-dom';
import Loader from '../components/Loader';
const logOut = () => setIsLoggedIn(false);

// Definimos los tipos para los datos que esperamos de la API
interface ApiResponse {  
  id: number;
  case_id: string;
  case_number: string;
  claim_number: string;
}[];

interface NameResponse { 
  names: string; 
}


const Cases: React.FC= () => {
  const [data, setData] = useState<ApiResponse[]>([]); 
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const { email } = location.state || {};


  // Función que maneja la solicitud a la API
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {

      // First API call to get names using the email 
      const nameResponse = await axios.get<NameResponse>(`/api/emailInsured?email=${email}`, {
         headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` } 
      }); 
      
      const names = nameResponse.data;
      
      console.log(names);
      
      // Hacemos la solicitud a la API de Cases por nombre
      await axios
      .get<ApiResponse[]>(`/api/cases?names=${names}`) // API de prueba
      .then((response) => {         
        var res = response.data;
        var obj = Object.values(res);
        setData(obj);
        setLoading(false);        
      })
      .catch(() => {
        setError('Hubo un error al cargar los datos.');       
      })
      .finally(()=>{
        setLoading(false);
      });



    } catch (error) {
      console.error('Error fetching cases:', error); 
      setError('Failed to fetch cases.');
    }

  };

  console.log(data ? data:"Fetching data ...")
  useEffect(()=>{
    fetchData();
  },[]);


  return (
    
    <div className='cases-list bg-amber-100 flex min-h-screen'  >  
       <section className="container mx-auto p-6 font-questrial">
        <h2 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5md lg:text-6md dark:text-white">List of <span className="underline underline-offset-3 decoration-8 decoration-tussock-400 dark:decoration-tussock-600">Cases</span></h2>
        <p className="text-md font-normal text-gray-500 lg:text-md dark:text-gray-400 mb-5">All of these cases are with us.</p>
        <div>
          {loading && <Loader />}
          {error && <p>{error}</p>}
        </div>
        <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg mt-5" >
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
                    {data.map(item=>(
                      <CaseInformation key={item.id}  arepons={item} />
                    ))}            
              </tbody>                
            </table>
          </div>
        </div>
      </section>



    </div>
  );
};

export default Cases;

function setIsLoggedIn(arg0: boolean) {
  throw new Error('Function not implemented.');
}




