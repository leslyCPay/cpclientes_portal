import React from 'react';

const Header: React.FC = () => {
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
        </div>
    );

}
export default Header;