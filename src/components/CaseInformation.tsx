import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  case_id: string;
  case_number: string;
  claim_number: string;
  [key: string]: any;
}

const CaseInformation: React.FC<{ arepons: Props }> = ({ arepons }) => {
  const navigate = useNavigate();

  const goToCaseDetails = (
    caseId: string,
    activeTab: string = "info",
    state: string = ""
  ) => {
    navigate(`/detail-case/${caseId}?tab=${activeTab}`, {
      state: { state },
    });
  };

  return (
    <tr
      className="bg-tussock-300 border-b border-tussock-500"
      key={arepons.case_id}
    >
      {Object.entries(arepons)
        .filter(([key]) => key !== "state")
        .map(([key, value]) => (
          <td
            scope="row"
            className="px-6 py-4 text-blue-50 whitespace-nowrap dark:text-blue-100 font-semibold uppercase"
            key={key}
          >
            {value}
          </td>
        ))}
      <td className="px-6 py-4" key={arepons.case_id}>
        <button
          key={arepons.case_id}
          onClick={() =>
            goToCaseDetails(arepons.case_id, "info", arepons.state)
          }
          type="button"
          className="w-auto text-white bg-tussock-500 hover:bg-tussock-600 focus:ring-4 focus:outline-none focus:ring-tussock-300 font-medium rounded-lg text-sm px-2 py-2.5 text-center inline-flex items-center"
        >
          <svg
            className="w-6 h-6 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
            />
          </svg>
        </button>
        <button
          type="button"
          key={"docs_" + arepons.case_id}
          onClick={() =>
            goToCaseDetails(arepons.case_id, "docs", arepons.state)
          }
          className=" docs-button w-auto text-white bg-tussock-500 hover:bg-tussock-600 focus:ring-4 focus:outline-none focus:ring-tussock-300 font-medium rounded-lg text-sm px-2 py-2.5 text-center inline-flex items-center mx-1"
        >
          <svg
            className="w-6 h-6 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 3v4a1 1 0 0 1-1 1H5m14-4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"
            />
          </svg>
        </button>
      </td>
    </tr>
  );
};

export default CaseInformation;
