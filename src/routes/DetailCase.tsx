import React, { useEffect, useState } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import Loader from '../components/Loader';
import BASE_URL from '../config'; // Import the base URL



const DetailCase: React.FC = () => {
    const { caseId } = useParams<{ caseId: string }>(); 
    const [caseDetails, setCaseDetails] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleBackButtonClick = () => {
        navigate(-1); // Navigate one step back in history
    };

    

    
    useEffect(() => { 
        const fetchCaseDetails = async () => { 
            try { 
                const response = await axios.get(`${BASE_URL}/api/details?case_id=${caseId}`); 
                setCaseDetails(response.data); 
            } catch (error) {                              
                console.error('Error fetching case details:', error); 
              
            } 
        }; 
        
        fetchCaseDetails(); 

    }, [caseId]);
    
    interface CurrencyFormatterParams {
        currency: string;
        value: number;
    }
        
    const currencyFormatter = ({ currency, value }: CurrencyFormatterParams): string => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        minimumFractionDigits: 2,
        currency,
    });
    return formatter.format(value);
    };
          
    
         
    return(
        
     <div className="h-full w-full ">       
            
            <div className="container mx-auto min-h-screen bg-amber-100">
                    <div >
                        <nav className="flex bg-gray-50 text-tussock-600 border border-gray-200 py-3 px-5 rounded-lg dark:bg-gray-800 dark:border-gray-700" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-3">
                            <li className="inline-flex items-center">
                            <a onClick={handleBackButtonClick} className="text-sm text-tussock-600 hover:text-tussock-900 inline-flex items-center dark:text-gray-400 dark:hover:text-white">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                                Cases
                            </a>
                            </li>
                            <li aria-current="page">
                            <div className="flex items-center">
                                <svg className="w-6 h-6 text-tussock-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                                <span className="text-tussock-400 ml-1 md:ml-2 text-sm font-medium dark:text-gray-500">Case Details</span>
                            </div>
                            </li>
                        </ol>
                        </nav>
                    </div>                               
                
                    <div className="w-11/12 lg:w-2/6 mx-auto py-16">                    
                        <div className="bg-gray-200 h-1 flex items-center justify-between">
                            <div className="w-1/3 bg-tussock-500 h-1 flex items-center">
                                <div className="bg-tussock-500 h-6 w-6 rounded-full shadow flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-check" width="18" height="18" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#FFFFFF" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" />
                                        <path d="M5 12l5 5l10 -10" />
                                    </svg>
                                </div>
                            </div>
                            <div className="w-1/3 flex justify-between bg-tussock-500 h-1 items-center relative">
                                <div className="absolute right-0 -mr-2">
                                    <div className="relative bg-white shadow-lg px-2 py-1 rounded mt-16 -mr-12">
                                        <svg className="absolute top-0 -mt-1 w-full right-0 left-0" width="16px" height="8px" viewBox="0 0 16 8" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
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
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-check" width="18" height="18" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#FFFFFF" fill="none" strokeLinecap="round" strokeLinejoin="round">
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
             

                <div className="flex flex-col gap-3 mt-4 min-h-full">                       

                    <div className="relative bg-amber-100 m-auto  px-6 py-4 w-full max-w-6xl shadow border-4 border-amber-600 rounded min-h-full justify-center mb-5" >
                       {caseDetails? (  
                        <header className=" grid grid-cols-4 "></header>
                    ): ( <Loader /> )}
                    {caseDetails? (
                        <div className="w-full grid grid-cols-3 pt-4" >                       
                           {/*  {Object.keys(caseDetails).map((key, index) => (                                
                                <div className='text-base leading-8 py-4' key={index}>
                                    <p className='text-xs font-semibold text-amber-700 uppercase'>{key.replace(/_/g, " ")}</p>
                                    <p  className='text-md text-gray-500'> {caseDetails['key']}</p>
                                </div>
                            ))}  */}
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>case id</p>
                                <p  className='text-md text-gray-500'> {caseDetails['case_id']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>status</p>
                                <p  className='text-md text-gray-500'> {caseDetails['status']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>insured</p>
                                <p  className='text-md text-gray-500'> {caseDetails['insured']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>address</p>
                                <p  className='text-md text-gray-500 pr-5'> {caseDetails['address']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>county</p>
                                <p  className='text-md text-gray-500'> {caseDetails['county']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>phone</p>
                                <p  className='text-md text-gray-500'> {caseDetails['phone']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>e-mail</p>
                                <p  className='text-md text-gray-500'> {caseDetails['e_mail']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>insurance company</p>
                                <p  className='text-md text-gray-500'> {caseDetails['insurance_company']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>policy number</p>
                                <p  className='text-md text-gray-500'> {caseDetails['policy_number']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>claim number</p>
                                <p  className='text-md text-gray-500'> {caseDetails['claim_number']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>date of loss</p>
                                <p  className='text-md text-gray-500'> {caseDetails['date_of_loss']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>denial reasons</p>
                                <p  className='text-md text-gray-500'> {caseDetails['denial_reasons']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>total bill amount</p>
                                <p  className='text-md text-gray-500'> {currencyFormatter({currency:'USD', value:caseDetails['total_bill_amount'],})}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>case number</p>
                                <p  className='text-md text-gray-500'> {caseDetails['case_number']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>Assigned Attorney</p>
                                <p  className='text-md text-gray-500'> {caseDetails['attorney']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>Legal Assistant</p>
                                <p  className='text-md text-gray-500'> {caseDetails['case_manager']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>public adjuster</p>
                                <p  className='text-md text-gray-500'> {caseDetails['public_adjuster']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>final status</p>
                                <p  className='text-md text-gray-500'> {caseDetails['final_status']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>depo of plaintiff date</p>
                                <p  className='text-md text-gray-500'> {caseDetails['depo_of_plaintiff_date']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>mediation date</p>
                                <p  className='text-md text-gray-500'> {caseDetails['mediation_date']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>pfs crn 57 105 status</p>
                                <p  className='text-md text-gray-500'> {caseDetails['pfs_crn_57_105_status']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>pfs received</p>
                                <p  className='text-md text-gray-500'> {caseDetails['pfs_received']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>pfs amount</p>
                                <p  className='text-md text-gray-500'> {currencyFormatter({currency:'USD', value:caseDetails['pfs_amount'],})}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>safe harbor letter received</p>
                                <p  className='text-md text-gray-500'> {caseDetails['safe_harbor_letter_received']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>trial date</p>
                                <p  className='text-md text-gray-500'> {caseDetails['trial_date']}</p>
                            </div>
                                        
                        </div>
                     ): ( <div></div> )}     
                    </div>
                   
                </div>

            </div>
        </div>

    );

}

export default DetailCase;