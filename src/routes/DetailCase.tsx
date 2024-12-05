import React, { useEffect, useState } from 'react'; 
import { useParams, Link } from 'react-router-dom'; 
import axios from 'axios';
import Loader from '../components/Loader';


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
    

    function newcaseDetails(def:any) {        
    
        const [array, setArray] = useState(def);

        const removeElements = (valuesToRemove: string[]) => {
            const newArray = array.filter((item:string) => !valuesToRemove.includes(item));
            setArray(newArray);
        };
    
        const handleRemove = () => {
            // Specify the values you want to remove
            const valuesToRemove = ["banana", "date"];
            removeElements(valuesToRemove);
        };
        handleRemove();
        return array;

    }

     
    return(
        
     <div className="h-full w-full ">       
            
            <div className="container mx-auto min-h-full">
                    <div >
                        <nav className="flex bg-gray-50 text-tussock-600 border border-gray-200 py-3 px-5 rounded-lg dark:bg-gray-800 dark:border-gray-700" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-3">
                            <li className="inline-flex items-center">
                            <a href="#" className="text-sm text-tussock-600 hover:text-tussock-900 inline-flex items-center dark:text-gray-400 dark:hover:text-white">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                                Home
                            </a>
                            </li>
                            <li>
                            <div className="flex items-center">
                                <svg className="w-6 h-6 text-tussock-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
                                <a href="" className="text-tussock-500 hover:text-gray-900 ml-1 md:ml-2 text-sm font-medium dark:text-gray-400 dark:hover:text-white">Cases</a>
                                <Link to="/cases">Cases</Link>
                            </div>
                            </li>
                            <li aria-current="page">
                            <div className="flex items-center">
                                <svg className="w-6 h-6 text-tussock-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
                                <span className="text-tussock-400 ml-1 md:ml-2 text-sm font-medium dark:text-gray-500">Details Case</span>
                            </div>
                            </li>
                        </ol>
                        </nav> 

                    </div>
                                
                
                    <div className="w-11/12 lg:w-2/6 mx-auto py-16">                
                    
                        <div className="bg-gray-200 h-1 flex items-center justify-between">
                            <div className="w-1/3 bg-tussock-500 h-1 flex items-center">
                                <div className="bg-tussock-500 h-6 w-6 rounded-full shadow flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-check" width="18" height="18" viewBox="0 0 24 24" stroke-width="1.5" stroke="#FFFFFF" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" />
                                        <path d="M5 12l5 5l10 -10" />
                                    </svg>
                                </div>
                            </div>
                            <div className="w-1/3 flex justify-between bg-tussock-500 h-1 items-center relative">
                                <div className="absolute right-0 -mr-2">
                                    <div className="relative bg-white shadow-lg px-2 py-1 rounded mt-16 -mr-12">
                                        <svg className="absolute top-0 -mt-1 w-full right-0 left-0" width="16px" height="8px" viewBox="0 0 16 8" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                <g id="Progress-Bars" transform="translate(-322.000000, -198.000000)" fill="#FFFFFF">
                                                    <g id="Group-4" transform="translate(310.000000, 198.000000)">
                                                        <polygon id="Triangle" points="20 0 28 8 12 8"></polygon>
                                                    </g>
                                                </g>
                                            </g>
                                        </svg>
                                        <p  className="focus:outline-none text-tussock-500 text-xs font-bold">Step 3: Analyzing</p>
                                    </div>
                                </div>
                                <div className="bg-tussock-500 h-6 w-6 rounded-full shadow flex items-center justify-center -ml-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-check" width="18" height="18" viewBox="0 0 24 24" stroke-width="1.5" stroke="#FFFFFF" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" />
                                        <path d="M5 12l5 5l10 -10" />
                                    </svg>
                                </div>
                                <div className="bg-white h-6 w-6 rounded-full shadow flex items-center justify-center -mr-3 relative">
                                    <div className="h-3 w-3 bg-tussock-500 rounded-full"></div>
                                </div>
                            </div>
                            <div className="w-1/3 flex justify-end">
                                <div className="bg-white h-6 w-6 rounded-full shadow"></div>
                            </div>
                        </div>
                    </div>
             







                {/* <div className="flex flex-col justify-center items-center h-[100vh]">
                    <div className="relative flex flex-col items-center rounded-[20px] w-[1200px] max-w-[95%] mx-auto bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:!shadow-none p-3">
                        {caseDetails? (
                        <div className="grid grid-cols-8 gap-4 px-2 w-full">
                            {Object.keys(caseDetails).map((key, index) => (                        
                                
                                <div key={index} className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
                                    <p className="text-sm text-gray-600">{key}</p>
                                    <p className="text-base font-medium text-navy-700 dark:text-white">
                                        {caseDetails[key]}
                                    </p>
                                </div>
                            ))}
                            
                        </div>
                        ): ( <Loader /> )}
                    </div>  
                </div> */}

                <div className="flex flex-col gap-4 mt-4 min-h-full">

                        

                    <div className="relative m-auto  px-6 py-4 w-full max-w-6xl bg-white shadow border-t-4 border-amber-600 rounded min-h-full" >
                       {caseDetails? (  
                        <header className=" grid grid-cols-4 "></header>
                    ): ( <Loader /> )}
                    {caseDetails? (
                        <div className="w-full grid grid-cols-4 pt-4" >                       
                            {Object.keys(caseDetails).map((key, index) => (                                
                                <div className='text-base leading-8 py-4' key={index}>
                                    <p className='text-xs font-semibold text-amber-700 uppercase'>{key}</p>
                                    <p  className='text-md text-gray-500'> {caseDetails[key]}</p>
                                </div>
                            ))}             
                        </div>
                     ): ( <div></div> )}     
                    </div>
                   
                </div>






            </div>
        </div>

    );

}


export default DetailCase;