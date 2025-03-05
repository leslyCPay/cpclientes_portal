import React, { useEffect, useState, useRef, Suspense, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import BASE_URL from "../config";
import ProgressBar from "../components/ProgressBar";
import toast, { Toaster } from "react-hot-toast";
import { HSTabs } from "preline";
import ErrorBoundary from "../components/ErrorBoundary";

const LazyDirectoryTree = React.lazy(() => {
  //console.log("Loading DirectoryTree...");
  return import("../components/DirectoryTree");
});

const LazyDocumentViewer = React.lazy(() => {
  //console.log("Loading DocumentViewer...");
  return import("../components/DocumentViewer");
});

const DetailCase: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const [caseDetails, setCaseDetails] = useState<any>(null);
  const [currentStepValue, setCurrentStepValue] = useState<string>("");
  const [labelStep, setlabelStep] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const activeTabFromQuery = queryParams.get("tab") || "info";
  const [activeTab, setActiveTab] = useState(activeTabFromQuery);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [recordId, setRecordId] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<
    { fileId: number; filename: string; filetype: string }[]
  >([]);
  const [viewFileUrl, setViewFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState(false);
  const [refreshTree, setRefreshTree] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const state = location.state?.state || "";

  const handleBackButtonClick = () => {
    navigate("/cases");
  };

  //console.log(caseId);

  useEffect(() => {
    const elements = document.querySelectorAll(".hs-tab, #data-hs-tab");
    elements.forEach((element) => {
      if (element) {
        HSTabs.autoInit();
      }
    });

    if (activeTab === "info" && !caseDetails) {
      const fetchCaseDetails = async () => {
        try {
          const response = await axios.get(
            `${BASE_URL}/api/details?case_id=${caseId}&state=${state}`
          );
          setCaseDetails(response.data);
          setCurrentStepValue(response.data.step);
          setlabelStep(response.data.stage);
          setRecordId(response.data.recordid);
        } catch (error) {
          console.error("Error fetching case details:", error);
        }
      };

      fetchCaseDetails();
    }
  }, [activeTab, caseId, caseDetails]);

  interface CurrencyFormatterParams {
    currency: string;
    value: number;
  }

  const currencyFormatter = ({
    currency,
    value,
  }: CurrencyFormatterParams): string => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      minimumFractionDigits: 2,
      currency,
    });
    return formatter.format(value);
  };

  const formattedTotalBillAmount = useMemo(() => {
    return currencyFormatter({
      currency: "USD",
      value: caseDetails?.total_bill_amount || 0,
    });
  }, [caseDetails?.total_bill_amount]);

  const steps = [
    "Pre-Litigation",
    "Complaint",
    "Plaintiff Discovery",
    "Plaintiff Deposition",
    "Plaintiff MSJ",
    "Appraisal",
    "Trial",
    "Settlement",
  ];

  // Update the active tab if the query parameter changes
  useEffect(() => {
    setActiveTab(activeTabFromQuery);
  }, [location.search]);

  const handleClickTab = (tab: string) => {
    setActiveTab(tab);
    navigate(`/detail-case/${caseId}?tab=${tab}`);
  };

  // Function to handle file selection and upload
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("record_id", recordId || "");

    try {
      const response = await axios.post(
        `${BASE_URL}/api/upload-file`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("File uploaded successfully:", response.data);
      toast.success("File uploaded successfully");

      // Trigger a refresh of the DirectoryTree
      setRefreshTree((prev) => !prev);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error uploading file:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
      } else {
        console.error("Error uploading file:", error);
      }
      toast.error("Error uploading file");
    } finally {
      setIsUploading(false);
    }
  };

  // Function to handle file selection
  const handleFileSelect = (
    fileId: number,
    filename: string,
    filetype: string,
    isSelected: boolean
  ) => {
    setSelectedFiles((prev) =>
      isSelected
        ? [...prev, { fileId, filename, filetype }]
        : prev.filter((file) => file.fileId !== fileId)
    );
  };

  // Function to handle downloads
  const handleDownload = async () => {
    if (selectedFiles.length === 0) return;
    setIsDownloading(true); // Start loading

    try {
      const response = await axios.post(
        `${BASE_URL}/api/download-files`,
        { files: selectedFiles },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const data = JSON.parse(response.config.data);
      const filename = data.files[0].filename;

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        selectedFiles.length === 1 ? `${filename}` : "files.zip"
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
      setTimeout(() => {
        setSelectedFiles([]);
      }, 1800);
    }
  };

  // Function to handle file viewer
  const handleFileView = async (attachmentId: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/file-viewer`, {
        params: {
          attachmentId: attachmentId,
        },
      });
      // Use the temporary URL directly
      const fileUrl = `${BASE_URL}${response.data.url}`;

      setViewFileUrl(fileUrl);
    } catch (err) {
      console.error("Error fetching file:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full ">
      <div className="mx-auto min-h-screen bg-amber-100">
        <div className="cp-breadcrumbs">
          <nav
            className="flex bg-gray-50 text-tussock-600 border border-gray-200 py-3 px-5 rounded-lg"
            aria-label="Breadcrumb"
          >
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <a
                  onClick={handleBackButtonClick}
                  className="text-sm text-tussock-600 hover:text-tussock-900 inline-flex items-center cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                  </svg>
                  Cases
                </a>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 text-tussock-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="text-tussock-400 ml-1 md:ml-2 text-sm font-medium dark:text-gray-500">
                    Case Details
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {caseDetails && (
          <ProgressBar
            steps={steps}
            currentStepValue={currentStepValue}
            labelStep={labelStep}
          />
        )}

        <div className="items-center mt-16 ">
          {/* START TABS */}

          <div className="border-b border-transparent ">
            <nav
              className="-mb-0.5 flex justify-center gap-x-6"
              aria-label="Tabs"
              role="tablist"
              aria-orientation="horizontal"
            >
              <button
                type="button"
                className={`py-4 px-1 inline-flex items-center gap-x-2 border-b-4 ${
                  activeTab === "info"
                    ? "border-tussock-500 text-tussock-600 font-semibold" // Active tab styles
                    : "border-gray-300 text-gray-500 hover:border-tussock-500 hover:text-tussock-600" // Inactive tab styles
                }`}
                id="info"
                aria-selected={activeTab === "info"}
                data-hs-tab="#info"
                aria-controls="info"
                onClick={() => handleClickTab("info")}
                role="tab"
              >
                Info
              </button>
              <button
                type="button"
                className={`py-4 px-1 inline-flex items-center gap-x-2 border-b-4 ${
                  activeTab === "docs"
                    ? "border-tussock-500 text-tussock-600 font-semibold" // Active tab styles
                    : "border-gray-300 text-gray-500 hover:border-tussock-500 hover:text-tussock-600" // Inactive tab styles
                }`}
                id="docs"
                aria-selected={activeTab === "docs"}
                data-hs-tab="#docs"
                aria-controls="docs"
                onClick={() => handleClickTab("docs")}
                role="tab"
              >
                Docs
              </button>
            </nav>
          </div>

          <div className="mt-8">
            {activeTab === "info" && (
              <div
                id="info"
                role="tabpanel"
                aria-labelledby="info"
                className={`${activeTab === "info" ? "block" : "hidden"}`}
              >
                <div className="cp-detailsCase flex flex-col gap-3 min-h-full">
                  <div className="relative bg-amber-100 m-auto  px-6 py-4 w-full max-w-6xl shadow border-4 border-amber-600 rounded min-h-full justify-center mb-8">
                    {caseDetails ? (
                      <React.Fragment>
                        <div className="w-full grid grid-cols-1 md:grid-cols-3 pt-4 m-auto">
                          {/*  {Object.keys(caseDetails).map((key, index) => (                                
                                  <div className='text-base leading-8 py-4' key={index}>
                                      <p className='text-xs font-semibold text-amber-700 uppercase'>{key.replace(/_/g, " ")}</p>
                                      <p  className='text-md text-gray-500'> {caseDetails['key']}</p>
                                  </div>
                              ))}  */}
                          <div className="text-base leading-8 py-4">
                            <p className="text-xs font-semibold text-amber-700 uppercase">
                              case id
                            </p>
                            <p className="text-md text-gray-500 pr-5 uppercase font-semibold">
                              {" "}
                              {caseDetails["case_id"]}
                            </p>
                          </div>
                          <div className="text-base leading-8 py-4">
                            <p className="text-xs font-semibold text-amber-700 uppercase">
                              status
                            </p>
                            <p className="text-md text-gray-500 pr-5 uppercase font-semibold">
                              {" "}
                              {caseDetails["status"]}
                            </p>
                          </div>
                          <div className="text-base leading-8 py-4">
                            <p className="text-xs font-semibold text-amber-700 uppercase">
                              insured
                            </p>
                            <p className="text-md text-gray-500 pr-5 uppercase font-semibold">
                              {" "}
                              {caseDetails["insured"]}
                            </p>
                          </div>
                          <div className="text-base leading-8 py-4">
                            <p className="text-xs font-semibold text-amber-700 uppercase">
                              address
                            </p>
                            <p className="text-md text-gray-500 pr-5 uppercase font-semibold">
                              {" "}
                              {caseDetails["address"]}
                            </p>
                          </div>
                          <div className="text-base leading-8 py-4">
                            <p className="text-xs font-semibold text-amber-700 uppercase">
                              county
                            </p>
                            <p className="text-md text-gray-500 pr-5 uppercase font-semibold">
                              {" "}
                              {caseDetails["county"]}
                            </p>
                          </div>
                          <div className="text-base leading-8 py-4">
                            <p className="text-xs font-semibold text-amber-700 uppercase">
                              phone
                            </p>
                            <p className="text-md text-gray-500 pr-5 uppercase font-semibold">
                              {" "}
                              {caseDetails["phone"]}
                            </p>
                          </div>
                          <div className="text-base leading-8 py-4">
                            <p className="text-xs font-semibold text-amber-700 uppercase">
                              e-mail
                            </p>
                            <p className="text-md text-gray-500 pr-5 uppercase font-semibold">
                              {" "}
                              {caseDetails["e_mail"]}
                            </p>
                          </div>
                          <div className="text-base leading-8 py-4">
                            <p className="text-xs font-semibold text-amber-700 uppercase">
                              insurance company
                            </p>
                            <p className="text-md text-gray-500 pr-5 uppercase font-semibold">
                              {" "}
                              {caseDetails["insurance_company"]}
                            </p>
                          </div>
                          <div className="text-base leading-8 py-4">
                            <p className="text-xs font-semibold text-amber-700 uppercase">
                              policy number
                            </p>
                            <p className="text-md text-gray-500 pr-5 uppercase font-semibold">
                              {" "}
                              {caseDetails["policy_number"]}
                            </p>
                          </div>
                          <div className="text-base leading-8 py-4">
                            <p className="text-xs font-semibold text-amber-700 uppercase">
                              claim number
                            </p>
                            <p className="text-md text-gray-500 pr-5 uppercase font-semibold">
                              {" "}
                              {caseDetails["claim_number"]}
                            </p>
                          </div>
                          <div className="text-base leading-8 py-4">
                            <p className="text-xs font-semibold text-amber-700 uppercase">
                              date of loss
                            </p>
                            <p className="text-md text-gray-500 pr-5 uppercase font-semibold">
                              {" "}
                              {caseDetails["date_of_loss"]}
                            </p>
                          </div>
                          <div className="text-base leading-8 py-4">
                            <p className="text-xs font-semibold text-amber-700 uppercase">
                              denial reasons
                            </p>
                            <p className="text-md text-gray-500 pr-5 uppercase font-semibold">
                              {" "}
                              {caseDetails["denial_reasons"]}
                            </p>
                          </div>
                          <div className="text-base leading-8 py-4">
                            <p className="text-xs font-semibold text-amber-700 uppercase">
                              total bill amount
                            </p>
                            <p className="text-md text-gray-500 pr-5 uppercase font-semibold">
                              {" "}
                              {formattedTotalBillAmount}
                            </p>
                          </div>
                          <div className="text-base leading-8 py-4">
                            <p className="text-xs font-semibold text-amber-700 uppercase">
                              case number
                            </p>
                            <p className="text-md text-gray-500 pr-5 uppercase font-semibold">
                              {" "}
                              {caseDetails["case_number"]}
                            </p>
                          </div>
                          <div className="text-base leading-8 py-4">
                            <p className="text-xs font-semibold text-amber-700 uppercase">
                              Assigned Attorney
                            </p>
                            <p className="text-md text-gray-500 pr-5 uppercase font-semibold">
                              {" "}
                              {caseDetails["attorney"]}
                            </p>
                          </div>
                          <div className="text-base leading-8 py-4">
                            <p className="text-xs font-semibold text-amber-700 uppercase">
                              Legal Assistant
                            </p>
                            <p className="text-md text-gray-500 pr-5 uppercase font-semibold">
                              {" "}
                              {caseDetails["case_manager"]}
                            </p>
                          </div>
                          <div className="text-base leading-8 py-4">
                            <p className="text-xs font-semibold text-amber-700 uppercase">
                              public adjuster
                            </p>
                            <p className="text-md text-gray-500 pr-5 uppercase font-semibold">
                              {" "}
                              {caseDetails["public_adjuster"]}
                            </p>
                          </div>
                          <div className="text-base leading-8 py-4">
                            <p className="text-xs font-semibold text-amber-700 uppercase">
                              final status
                            </p>
                            <p className="text-md text-gray-500 pr-5 uppercase font-semibold">
                              {" "}
                              {caseDetails["final_status"]}
                            </p>
                          </div>
                          <div className="text-base leading-8 py-4">
                            <p className="text-xs font-semibold text-amber-700 uppercase">
                              depo of plaintiff date
                            </p>
                            <p className="text-md text-gray-500 pr-5 uppercase font-semibold">
                              {" "}
                              {caseDetails["depo_of_plaintiff_date"]}
                            </p>
                          </div>
                          <div className="text-base leading-8 py-4">
                            <p className="text-xs font-semibold text-amber-700 uppercase">
                              mediation date
                            </p>
                            <p className="text-md text-gray-500 pr-5 uppercase font-semibold">
                              {" "}
                              {caseDetails["mediation_date"]}
                            </p>
                          </div>
                          <div className="text-base leading-8 py-4">
                            <p className="text-xs font-semibold text-amber-700 uppercase">
                              pfs crn 57 105 status
                            </p>
                            <p className="text-md text-gray-500 pr-5 uppercase font-semibold">
                              {" "}
                              {caseDetails["pfs_crn_57_105_status"]}
                            </p>
                          </div>
                          <div className="text-base leading-8 py-4">
                            <p className="text-xs font-semibold text-amber-700 uppercase">
                              pfs received
                            </p>
                            <p className="text-md text-gray-500 pr-5 uppercase font-semibold">
                              {" "}
                              {caseDetails["pfs_received"]}
                            </p>
                          </div>
                          <div className="text-base leading-8 py-4">
                            <p className="text-xs font-semibold text-amber-700 uppercase">
                              pfs amount
                            </p>
                            <p className="text-md text-gray-500 pr-5 uppercase font-semibold">
                              {" "}
                              {formattedTotalBillAmount}
                            </p>
                          </div>
                          <div className="text-base leading-8 py-4">
                            <p className="text-xs font-semibold text-amber-700 uppercase">
                              safe harbor letter received
                            </p>
                            <p className="text-md text-gray-500 pr-5 uppercase font-semibold">
                              {" "}
                              {caseDetails["safe_harbor_letter_received"]}
                            </p>
                          </div>
                          <div className="text-base leading-8 py-4">
                            <p className="text-xs font-semibold text-amber-700 uppercase">
                              trial date
                            </p>
                            <p className="text-md text-gray-500 pr-5 uppercase font-semibold">
                              {" "}
                              {caseDetails["trial_date"]}
                            </p>
                          </div>
                        </div>
                      </React.Fragment>
                    ) : (
                      <Loader />
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "docs" && (
              <div
                id="docs"
                role="tabpanel"
                aria-labelledby="docs"
                className={`${activeTab === "docs" ? "block" : "hidden"}`}
              >
                <div className="cp-docs flex flex-col gap-3 min-h-full">
                  <div className="relative bg-amber-100 m-auto  px-6 py-4 w-full max-w-6xl shadow  min-h-screen justify-center mb-8">
                    <div className="grid grid-flow-col gap-3 ">
                      <div className="col-span-2 md:col-span-1 h-100 max-w-max ">
                        <button
                          type="button"
                          className={`m-auto py-3 px-4 mx-5 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-tussock-500 text-white hover:bg-tussock-400 focus:outline-none focus:bg-tussock-400 ${
                            selectedFiles.length === 0 || isDownloading
                              ? "opacity-50 pointer-events-none"
                              : ""
                          }`}
                          disabled={selectedFiles.length === 0 || isDownloading}
                          onClick={handleDownload}
                        >
                          {isDownloading ? (
                            <>
                              <svg
                                aria-hidden="true"
                                role="status"
                                className="inline w-4 h-4 me-3 text-white animate-spin"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                  fill="currentColor"
                                />
                                <path
                                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                  fill="#B66729"
                                />
                              </svg>
                              Downloading...
                            </>
                          ) : (
                            <>
                              Download File(s)
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
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"
                                />
                              </svg>
                            </>
                          )}
                        </button>

                        <input
                          type="file"
                          ref={fileInputRef}
                          style={{ display: "none" }}
                          onChange={handleFileUpload}
                        />
                        <button
                          type="button"
                          className="m-auto py-3 px-4 mx-5 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-black text-white hover:bg-gray-800 focus:outline-none focus:bg-gray-800 mt-4 md:mt-0"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Upload File(s)
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
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 5v9m-5 0H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2M8 9l4-5 4 5m1 8h.01"
                            />
                          </svg>
                        </button>
                        <div
                          className="mt-8 mx-3 overflow-y-auto overflow-x-hidden h-[550px] min-w-full [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300"
                        >
                          {isUploading ? (
                            <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-10">
                              <div>Loading...</div> {/* Show loading spinner */}
                            </div>
                          ) : (
                            <Toaster
                              toastOptions={{
                                success: {
                                  style: {
                                    background: "bg-green-200",
                                  },
                                },
                                error: {
                                  style: {
                                    background: "bg-red-200",
                                  },
                                },
                              }}
                            />
                          )}

                          <Suspense fallback={<Loader />}>
                            {activeTab === "docs" && (
                              <ErrorBoundary>
                                <LazyDirectoryTree
                                  key={activeTab}
                                  caseId={caseId}
                                  onFileSelect={handleFileSelect}
                                  selectedFiles={selectedFiles}
                                  onFileView={handleFileView}
                                  refreshTree={refreshTree}
                                />
                              </ErrorBoundary>
                            )}
                          </Suspense>
                        </div>
                      </div>
                      <div className="col-span-2 md:col-span-4 mt-4 xs:w-full text-center h-[650px] border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <Suspense fallback={<Loader />}>
                          {viewFileUrl ? (
                            <LazyDocumentViewer url={viewFileUrl} />
                          ) : (
                            <span className="text-gray-300">
                              Document Viewer
                            </span>
                          )}
                        </Suspense>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* END TABS */}
        </div>
      </div>
    </div>
  );
};

export default DetailCase;
