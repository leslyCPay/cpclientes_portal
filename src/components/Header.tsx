import React, { useState } from 'react';

const Header: React.FC = () => {

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
        () => localStorage.getItem('logged_user') !== null
      );

     // setIsLoggedIn(false);

      

    return(
        
        <div className="flex justify-between bg-black p-8">
            <img
            alt="Home Owners Page"
            src="https://cdn.prod.website-files.com/66bbb545d353c3a7e92ecca8/66bfa0324666062ecfd9d674_Insurance%20Trial%20Lawyers%20Logo.svg?color=indigo&shade=200"
            className="mx-auto h-10 w-auto"
            /> 
            {/*<input
            className="w-36 rounded-full bg-red-50 px-4 py-2 transition-all focus:w-60"
            placeholder="Search.."
            />*/}
          
            {isLoggedIn? (
                <div>
                    <input id="avatarButton" type="button" data-dropdown-toggle="userDropdown" data-dropdown-placement="bottom-start" className="w-10 h-10 rounded-full cursor-pointer" src="/docs/images/people/profile-picture-5.jpg" alt="User dropdown" />
                      <div id="userDropdown" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                        <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        <div>Bonnie Green</div>
                        <div className="font-medium truncate">name@flowbite.com</div>
                        </div>
                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="avatarButton">
                        <li>
                            <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
                        </li>
                        <li>
                            <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
                        </li>
                        <li>
                            <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a>
                        </li>
                        </ul>
                        <div className="py-1">
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</a>
                        </div>
                    </div>
                </div>             


            ): (<div></div> ) }
            
        </div>
    );

}
export default Header;