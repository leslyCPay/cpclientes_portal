import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CaseInformation from '../components/CaseInformation';
import { useLocation } from 'react-router-dom';

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
    
    <div className='cases-list' >
      {loading && <p>Loding...</p>}
      {error && <p>{error}</p>}
      <h2 className='mt-5 text-left text-2xl/9 font-bold tracking-tight text-gray-900 pl-8'  >List of Cases</h2>
   
       <section className="container mx-auto p-6 font-mono">
        <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
          <div className="w-full overflow-x-auto">
            <table className="w-full">
              <thead>         
                <tr className="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
                  <th className="px-4 py-3">CASE ID</th>
                  <th className="px-4 py-3">CLAIM NUMBER</th>
                  <th className="px-4 py-3">CASE STATUS</th>                  
                  <th className="px-4 py-3">ACTIONS</th>
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

/*function setIsLoggedIn(arg0: boolean) {
  throw new Error('Function not implemented.');
}*/

