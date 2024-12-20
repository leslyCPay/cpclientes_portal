import React, { useEffect, useState } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import Loader from '../components/Loader';
import BASE_URL from '../config'; // Import the base URL
import ProgressBar from '../components/ProgressBar';


const DetailCase: React.FC = () => {
    const { caseId } = useParams<{ caseId: string }>(); 
    const [caseDetails, setCaseDetails] = useState<any>(null);
    const [currentStepValue, setCurrentStepValue] = useState<string>('');
    const [labelStep, setlabelStep] = useState<string>('');
    const navigate = useNavigate();

    const handleBackButtonClick = () => {
        navigate(-1); 
    }; 

    
    useEffect(() => { 
        const fetchCaseDetails = async () => { 
            try { 
                const response = await axios.get(`${BASE_URL}/api/details?case_id=${caseId}`); 
                setCaseDetails(response.data);                            
                setCurrentStepValue(response.data.step);
                setlabelStep(response.data.stage);
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

    
    const steps = ['Pre-Litigation', 'Complaint', 'Plaintiff Discovery', 'Plaintiff Deposition','Plaintiff MSJ','Appraisal','Trial','Settlement']; 
   

    return(
        
     <div className="h-full w-full ">            
            <div className="mx-auto min-h-screen bg-amber-100">
                    <div className='cp-breadcrumbs' >
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
                    
                    {caseDetails&& (  
                            <ProgressBar steps={steps} currentStepValue={currentStepValue} labelStep={labelStep} />
                    )}

                <div className="cp-detailsCase flex flex-col gap-3 mt-16 min-h-full"> 
                    <div className="relative bg-amber-100 m-auto  px-6 py-4 w-full max-w-6xl shadow border-4 border-amber-600 rounded min-h-full justify-center mb-8" >
                    {caseDetails ? (
                        <React.Fragment>
                         

                        <div className="w-full grid grid-cols-3 pt-4" >
                                                   
                           {/*  {Object.keys(caseDetails).map((key, index) => (                                
                                <div className='text-base leading-8 py-4' key={index}>
                                    <p className='text-xs font-semibold text-amber-700 uppercase'>{key.replace(/_/g, " ")}</p>
                                    <p  className='text-md text-gray-500'> {caseDetails['key']}</p>
                                </div>
                            ))}  */}
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>case id</p>
                                <p  className='text-md text-gray-500 pr-5'> {caseDetails['case_id']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>status</p>
                                <p  className='text-md text-gray-500 pr-5'> {caseDetails['status']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>insured</p>
                                <p  className='text-md text-gray-500 pr-5'> {caseDetails['insured']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>address</p>
                                <p  className='text-md text-gray-500 pr-5'> {caseDetails['address']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>county</p>
                                <p  className='text-md text-gray-500 pr-5'> {caseDetails['county']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>phone</p>
                                <p  className='text-md text-gray-500 pr-5'> {caseDetails['phone']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>e-mail</p>
                                <p  className='text-md text-gray-500 pr-5'> {caseDetails['e_mail']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>insurance company</p>
                                <p  className='text-md text-gray-500 pr-5'> {caseDetails['insurance_company']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>policy number</p>
                                <p  className='text-md text-gray-500'> {caseDetails['policy_number']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>claim number</p>
                                <p  className='text-md text-gray-500 pr-5'> {caseDetails['claim_number']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>date of loss</p>
                                <p  className='text-md text-gray-500 pr-5'> {caseDetails['date_of_loss']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>denial reasons</p>
                                <p  className='text-md text-gray-500 pr-5'> {caseDetails['denial_reasons']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>total bill amount</p>
                                <p  className='text-md text-gray-500 pr-5'> {currencyFormatter({currency:'USD', value:caseDetails['total_bill_amount'],})}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>case number</p>
                                <p  className='text-md text-gray-500 pr-5'> {caseDetails['case_number']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>Assigned Attorney</p>
                                <p  className='text-md text-gray-500 pr-5'> {caseDetails['attorney']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>Legal Assistant</p>
                                <p  className='text-md text-gray-500 pr-5'> {caseDetails['case_manager']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>public adjuster</p>
                                <p  className='text-md text-gray-500 pr-5'> {caseDetails['public_adjuster']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>final status</p>
                                <p  className='text-md text-gray-500 pr-5'> {caseDetails['final_status']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>depo of plaintiff date</p>
                                <p  className='text-md text-gray-500 pr-5'> {caseDetails['depo_of_plaintiff_date']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>mediation date</p>
                                <p  className='text-md text-gray-500 pr-5'> {caseDetails['mediation_date']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>pfs crn 57 105 status</p>
                                <p  className='text-md text-gray-500 pr-5'> {caseDetails['pfs_crn_57_105_status']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>pfs received</p>
                                <p  className='text-md text-gray-500 pr-5'> {caseDetails['pfs_received']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>pfs amount</p>
                                <p  className='text-md text-gray-500 pr-5'> {currencyFormatter({currency:'USD', value:caseDetails['pfs_amount'],})}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>safe harbor letter received</p>
                                <p  className='text-md text-gray-500 pr-5'> {caseDetails['safe_harbor_letter_received']}</p>
                            </div>
                            <div className='text-base leading-8 py-4'>
                                <p className='text-xs font-semibold text-amber-700 uppercase'>trial date</p>
                                <p  className='text-md text-gray-500 pr-5'> {caseDetails['trial_date']}</p>
                            </div>
                                        
                        </div>
                        </React.Fragment>
                     ): ( <Loader /> )}     
                    </div>
                   
                </div>

            </div>
        </div>

    );

}

export default DetailCase;