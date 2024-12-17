import React, { useEffect } from 'react'; 
import { Dropdown  } from 'flowbite';
import type { DropdownOptions } from 'flowbite';
import type { InstanceOptions } from 'flowbite';

interface HeaderProps { 
    isLoggedIn: boolean;
    onSignOut: () => void; 
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onSignOut }) => {
 
    useEffect(() => { 
        const $targetEl = document.getElementById('dropdownAvatarName'); 
        const $triggerEl = document.getElementById('dropdownAvatarNameButton'); 
        
        if ($targetEl && $triggerEl) { 
            const options: DropdownOptions = { 
                placement: 'bottom', 
                triggerType: 'click', 
                offsetSkidding: 0, 
                offsetDistance: 10, 
                delay: 300, 
                onHide: () => { 
                    console.log('dropdown has been hidden'); 
                }, 
                onShow: () => { 
                    console.log('dropdown has been shown'); 
                }, 
                onToggle: () => { 
                    console.log('dropdown has been toggled'); 
                }, }; 
                const instanceOptions: InstanceOptions = { 
                    id: 'dropdownAvatarName', override: true 
                }; 
        
        new Dropdown($targetEl, $triggerEl, options, instanceOptions); 
    } }, [isLoggedIn]); 
    
    return(
        
        <div className="flex justify-between bg-black p-8">
            <img
            alt="Home Owners Page"
            src="https://cdn.prod.website-files.com/66bbb545d353c3a7e92ecca8/66bfa0324666062ecfd9d674_Insurance%20Trial%20Lawyers%20Logo.svg?color=indigo&shade=200"
            className="mx-auto h-10 w-auto"
            /> 
    
            {isLoggedIn && (
                <div className='profile-header'>                   
                    <button id="dropdownAvatarNameButton" data-dropdown-toggle="dropdownAvatarName" className=" bg-tussock-500 flex items-center text-sm pe-1 font-medium text-gray-900 rounded-full hover:text-tussock-100 hover:bg-tussock-500 dark:hover:text-tussock-400 md:me-0 focus:ring-4 focus:ring-tussock-500 dark:focus:ring-tussock-600 dark:text-white pr-5" type="button">
                        <span className="sr-only">Open user menu</span>

                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>

                        {/*  <img className="w-8 h-8 me-2 rounded-full" src="/docs/images/people/profile-picture-3.jpg" alt="user photo" /> */}
                        {/* Bonnie Green */}
                        <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                        </svg>
                    </button>


                    <div id="dropdownAvatarName" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                       {/*  <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        <div className="font-medium ">Client</div>
                        <div className="truncate">hola@claimpay.net</div>
                        </div> */}
                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownInformdropdownAvatarNameButtonationButton">
                            <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Change Password</a>
                            </li>
                        </ul>
                        <div className="py-2">
                        <a onClick={onSignOut}  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</a>
                        </div>
                    </div>

                </div>             


            )}
            
        </div>
    );

}
export default Header;