import React from "react";

interface FooterProps {
  copyrightText: any;
}

const Footer: React.FC<FooterProps> = ({ copyrightText }) => {
  return (
    <footer className="bg-black py-4 text-center">
      <div className="container mx-auto px-4">
        <h1 className="text-gray-400 text-sm">{copyrightText}</h1>
      </div>
    </footer>
  );
};
export default Footer;
