import React, { useEffect, useState } from "react";
import axios from "axios";
import CaseInformation from "../components/CaseInformation";
import { useLocation } from "react-router-dom";
import Loader from "../components/Loader";
import BASE_URL from "../config";

interface ApiResponse {
  id: number;
  case_id: string;
  case_number: string;
  claim_number: string;
  state: string;
  final_status: string;
  status: string;
}

interface NameResponse {
  names: string[];
}

interface SuccessfulResponse {
  data: ApiResponse[];
}

interface FailedResponse {
  error: any;
  name: string;
}

type Response = SuccessfulResponse | FailedResponse;

const Cases: React.FC = () => {
  const [data, setData] = useState<ApiResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const email =
    localStorage.getItem("email") || (location.state && location.state.email);

  const isFailedResponse = (response: Response): response is FailedResponse => {
    return "error" in response;
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const nameResponse = await axios.get<NameResponse>(
        `${BASE_URL}/api/cases?email=${email}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );

      const names = nameResponse.data;

      if (!Array.isArray(names)) {
        throw new Error("Expected an array of names");
      }

      setData(names);
    } catch (error) {
      setError("Failed to fetch cases.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl mb-2 text-gray-900 tracking-tight font-questrial">
            My Cases
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"></div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <Loader />
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Table Header */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4">
              <div className="grid grid-cols-12 gap-4 text-black font-semibold text-sm uppercase tracking-wide">
                <div className="col-span-2">Case ID</div>
                <div className="col-span-2">Stage</div>
                <div className="col-span-2">Claim Number</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-4 text-right">Actions</div>
              </div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-100">
              {data.length === 0 ? (
                <div className="px-6 py-16 text-center text-gray-400">
                  <svg
                    className="w-12 h-12 mx-auto mb-3 opacity-40"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-sm">No cases found</p>
                </div>
              ) : (
                data.map((item) => (
                  <CaseInformation key={item.case_id} arepons={item} />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cases;
