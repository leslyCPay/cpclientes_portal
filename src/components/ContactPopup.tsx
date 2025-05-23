import { useState } from "react";
import { FiCopy, FiMail, FiPhone } from "react-icons/fi"; // Install with: npm install react-icons

interface ContactPopupProps {
  email: string;
  phone: string;
  children: React.ReactNode;
}

const ContactPopup = ({ email, phone, children }: ContactPopupProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="inline-block"
      >
        {children}
      </div>

      {isVisible && (
        <div
          className="absolute z-50 left-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 p-3"
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FiMail className="text-gray-500 mr-2" />
                <span className="text-sm text-gray-700">{email}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(email, "email");
                }}
                className="text-gray-500 hover:text-blue-600 p-1 rounded"
                title="Copy email"
              >
                <FiCopy size={14} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FiPhone className="text-gray-500 mr-2" />
                <span className="text-sm text-gray-700">{phone}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(phone, "phone");
                }}
                className="text-gray-500 hover:text-blue-600 p-1 rounded"
                title="Copy phone"
              >
                <FiCopy size={14} />
              </button>
            </div>
          </div>
          {copiedField && (
            <div className="text-xs text-green-600 mt-1">
              {copiedField === "email" ? "Email" : "Phone"} copied to clipboard!
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default ContactPopup;
