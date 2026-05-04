import { Phone, Mail } from "lucide-react";

const ContactHighlight: React.FC<{
  name: string;
  email: string;
  phone: string;
}> = ({ name, email, phone }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex flex-col gap-2.5 mt-1">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-medium flex-shrink-0">
          {initials}
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900 uppercase">
            {name}
          </div>
          <div className="text-xs text-gray-500">Legal Assistant</div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-2 flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-sm">
          <Phone className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
          <span className="text-gray-400 text-xs w-10">Phone</span>
          <span className="font-medium text-gray-900 text-xs">{phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Mail className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
          <span className="text-gray-400 text-xs w-10">Email</span>
          <span className="font-medium text-blue-700 text-xs truncate">
            {email}
          </span>
        </div>
      </div>
    </div>
  );
};
export default ContactHighlight;
