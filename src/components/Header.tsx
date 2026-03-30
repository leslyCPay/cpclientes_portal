import React, { useEffect } from "react";
import { Dropdown } from "flowbite";
import type { DropdownOptions } from "flowbite";
import type { InstanceOptions } from "flowbite";
import { useNavigate } from "react-router-dom";
import { User, ChevronDown, LogOut, Key } from "lucide-react";

interface HeaderProps {
  isLoggedIn: boolean;
  onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onSignOut }) => {
  const navigate = useNavigate();
  useEffect(() => {
    const $targetEl = document.getElementById("dropdownAvatarName");
    const $triggerEl = document.getElementById("dropdownAvatarNameButton");

    if ($targetEl && $triggerEl) {
      const options: DropdownOptions = {
        placement: "bottom",
        triggerType: "click",
        offsetSkidding: 0,
        offsetDistance: 10,
        delay: 300,
        onHide: () => {
          //console.log('dropdown has been hidden');
        },
        onShow: () => {
          //console.log('dropdown has been shown');
        },
        onToggle: () => {
          //console.log('dropdown has been toggled');
        },
      };
      const instanceOptions: InstanceOptions = {
        id: "dropdownAvatarName",
        override: true,
      };

      new Dropdown($targetEl, $triggerEl, options, instanceOptions);
    }
  }, [isLoggedIn]);

  return (
    <div className="flex justify-between bg-black p-4 border-b border-amber-500/20">
      <a
        className={isLoggedIn ? "items-start" : "mx-auto"}
        onClick={() => navigate("/")}
      >
        <div className="bg-black px-6">
          <div className="max-w-7xl  flex ">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-2 rounded-lg">
                <div className="w-8 h-8 border-2 border-black flex items-center justify-center">
                  <span className="text-black font-black text-sm">ITL</span>
                </div>
              </div>
              <div>
                <div className="text-amber-400 font-bold text-lg tracking-wide">
                  INSURANCE
                </div>
                <div className="text-amber-300/70 text-xs tracking-widest">
                  TRIAL LAWYERS
                </div>
              </div>
            </div>
          </div>
        </div>
      </a>

      {/*<input
            className="w-36 rounded-full bg-red-50 px-4 py-2 transition-all focus:w-60"
            placeholder="Search.."
            />*/}

      {isLoggedIn && (
        <div className="profile-header">
          <button
            id="dropdownAvatarNameButton"
            data-dropdown-toggle="dropdownAvatarName"
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black px-6 py-4 rounded-full transition-all shadow-md hover:shadow-lg"
            type="button"
          >
            <span className="sr-only">Open user menu</span>

            <User className="w-4 h-4" />
            <ChevronDown className="w-4 h-4" />
          </button>

          <div
            id="dropdownAvatarName"
            className="z-10 hidden bg-white  rounded-lg shadow w-44 dark:bg-gray-700"
          >
            {/*  <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        <div className="font-medium ">Client</div>
                        <div className="truncate">hola@claimpay.net</div>
                        </div> */}
            <ul
              className="py-2 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownInformdropdownAvatarNameButtonationButton"
            >
              <li>
                <a
                  onClick={() => navigate("/change-password")}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-amber-50 transition-colors text-left text-gray-700 hover:text-amber-700"
                >
                  <Key className="w-4 h-4" />
                  Change Password
                </a>
              </li>
            </ul>
            <div className="py-2 cursor-pointer">
              <a
                onClick={onSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left text-gray-700 hover:text-red-600"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Header;
