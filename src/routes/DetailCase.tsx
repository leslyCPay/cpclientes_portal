import React, { useEffect, useState, useRef, Suspense, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import BASE_URL from "../config";
import ProgressBar from "../components/ProgressBar";
import toast, { Toaster } from "react-hot-toast";
import { HSTabs } from "preline";
import ErrorBoundary from "../components/ErrorBoundary";
import ContactPopup from "../components/ContactPopup";
import { Messages } from "../components/Messages";
import { Home, ChevronRight, Download, Upload } from "lucide-react";
import {
  User,
  MapPin,
  Phone,
  Mail,
  FileText,
  Calendar,
  Shield,
  Gavel,
  UserCheck,
  DollarSign,
  AlertCircle,
} from "lucide-react";

const LazyDirectoryTree = React.lazy(
  () => import("../components/DirectoryTree"),
);
const LazyDocumentViewer = React.lazy(
  () => import("../components/DocumentViewer"),
);

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
  const [recordId, setRecordId] = useState<string | null>("");
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

  useEffect(() => {
    const elements = document.querySelectorAll(".hs-tab, #data-hs-tab");
    elements.forEach((element) => {
      if (element) HSTabs.autoInit();
    });

    if (activeTab === "info" && !caseDetails) {
      const fetchCaseDetails = async () => {
        try {
          const response = await axios.get(
            `${BASE_URL}/api/details?case_id=${caseId}&state=${state}`,
          );
          setCaseDetails(response.data[0]);
          setCurrentStepValue(response.data[0].step);
          setlabelStep(response.data[0].stage);
          setRecordId(response.data[0].casesid);
        } catch (error) {}
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

  useEffect(() => {
    setActiveTab(activeTabFromQuery);
    if (activeTabFromQuery === "docs") {
      const recordid = sessionStorage.getItem("record_id");
      setRecordId(recordid);
    }
  }, [location.search]);

  const handleClickTab = (tab: string) => {
    setActiveTab(tab);
    navigate(`/detail-case/${caseId}?tab=${tab}`);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("record_id", recordId || "");

    try {
      await axios.post(`${BASE_URL}/api/upload-file`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("File uploaded successfully");
      setRefreshTree((prev) => !prev);
    } catch (error) {
      toast.error("Error uploading file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (
    fileId: number,
    filename: string,
    filetype: string,
    isSelected: boolean,
  ) => {
    setSelectedFiles((prev) =>
      isSelected
        ? [...prev, { fileId, filename, filetype }]
        : prev.filter((file) => file.fileId !== fileId),
    );
  };

  const handleDownload = async () => {
    if (selectedFiles.length === 0) return;
    setIsDownloading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/download-files`,
        { files: selectedFiles },
        { responseType: "blob" },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const data = JSON.parse(response.config.data);
      const filename = data.files[0].filename;
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        selectedFiles.length === 1 ? `${filename}` : "files.zip",
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
      setTimeout(() => setSelectedFiles([]), 1800);
    }
  };

  const handleFileView = async (attachmentId: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/file-viewer`, {
        params: { attachmentId },
      });
      const fileUrl = `${BASE_URL}${response.data.url}`;
      setViewFileUrl(fileUrl);
    } catch (err) {
      console.error("Error fetching file:", err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "info", label: "Info" },
    { id: "docs", label: "Docs" },
    { id: "messages", label: "Messages" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumbs — Figma style */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <button
            onClick={handleBackButtonClick}
            className="flex items-center gap-1 text-amber-600 hover:text-amber-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            Cases
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">Case Details</span>
        </div>

        {/* Progress Bar */}
        {caseDetails && (
          <ProgressBar
            steps={steps}
            currentStepValue={currentStepValue}
            labelStep={labelStep}
          />
        )}

        {/* Tabs */}
        <div className="bg-white rounded-t-2xl shadow-md border-b border-gray-200 overflow-hidden mt-6">
          <div className="flex gap-1 px-6 pt-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleClickTab(tab.id)}
                aria-selected={activeTab === tab.id}
                role="tab"
                className={`px-6 py-3 font-medium transition-all rounded-t-lg text-sm ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-2xl shadow-md p-8">
          {/* INFO TAB */}
          {activeTab === "info" && (
            <div id="info" role="tabpanel" aria-labelledby="info">
              {caseDetails ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Client Information */}
                  <InfoCard
                    icon={<User className="w-5 h-5 text-amber-700" />}
                    iconBg="bg-amber-100"
                    iconColor="text-amber-700"
                    title="Client Information"
                  >
                    <InfoField label="Insured">
                      <div className="font-bold uppercase">
                        {caseDetails["insured"]}
                      </div>
                    </InfoField>
                    <InfoField
                      label={
                        <>
                          <MapPin className="w-3 h-3" /> ADDRESS
                        </>
                      }
                    >
                      <div className="uppercase">{caseDetails["address"]}</div>
                    </InfoField>
                    <InfoField
                      label={
                        <>
                          <Phone className="w-3 h-3" /> PHONE
                        </>
                      }
                    >
                      {caseDetails["insured_phone"]}
                    </InfoField>
                    <InfoField
                      label={
                        <>
                          <Mail className="w-3 h-3" /> E-MAIL
                        </>
                      }
                    >
                      <div className="uppercase">
                        {caseDetails["insured_email"]}
                      </div>
                    </InfoField>
                  </InfoCard>

                  {/* Case Details */}
                  <InfoCard
                    icon={<FileText />}
                    iconBg="bg-blue-100"
                    iconColor="text-blue-700"
                    title="Case Details"
                  >
                    <InfoField label="Case ID">
                      <div className="font-bold">{caseDetails["case_id"]}</div>
                    </InfoField>
                    <InfoField label="Case Number">
                      {caseDetails["case_number"]}
                    </InfoField>
                    <InfoField label="Claim Number">
                      {caseDetails["claim_number"]}
                    </InfoField>
                    <InfoField label="County">
                      {caseDetails["county"]}
                    </InfoField>
                    <InfoField
                      label={
                        <>
                          <Calendar className="w-3 h-3" /> DATE OF LOSS
                        </>
                      }
                    >
                      {caseDetails["date_of_loss"]}
                    </InfoField>
                  </InfoCard>

                  {/* Insurance Details */}
                  <InfoCard
                    icon={<Shield className="w-5 h-5 text-purple-700" />}
                    iconBg="bg-purple-100"
                    iconColor="text-purple-700"
                    title="Insurance Details"
                  >
                    <InfoField label="Insurance Company">
                      {caseDetails["insurance_company"]}
                    </InfoField>
                    <InfoField label="Policy Number">
                      {caseDetails["policy_number"]}
                    </InfoField>
                    <InfoField
                      label={
                        <>
                          <AlertCircle className="w-3 h-3" /> DENIAL REASONS
                        </>
                      }
                    >
                      {caseDetails["denial_reasons"]}
                    </InfoField>
                    <InfoField label="Final Status">
                      <FinalStatusBadge status={caseDetails["final_status"]} />
                    </InfoField>
                  </InfoCard>

                  {/* Legal Team */}
                  <InfoCard
                    icon={<Gavel className="w-5 h-5 text-green-700" />}
                    iconBg="bg-green-100"
                    iconColor="text-green-700"
                    title="Legal Team"
                  >
                    <InfoField
                      label={
                        <>
                          <UserCheck className="w-3 h-3" /> ASSIGNED ATTORNEY
                        </>
                      }
                    >
                      {caseDetails["attorney"]}
                    </InfoField>
                    <InfoField label="Legal Assistant">
                      <ContactPopup
                        email={
                          caseDetails["case_manager_email"] || "Not available"
                        }
                        phone={
                          caseDetails["case_manager_phone"] || "Not available"
                        }
                      >
                        <a className="inline-flex items-center gap-1.5 text-blue-700 hover:text-blue-900 cursor-pointer font-medium">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="uppercase text-sm">
                            {caseDetails["case_manager_name"]}
                          </span>
                        </a>
                      </ContactPopup>
                    </InfoField>
                    <InfoField label="Public Adjuster">
                      {caseDetails["public_adjuster"]}
                    </InfoField>
                  </InfoCard>

                  {/* Important Dates */}
                  <InfoCard
                    icon={<Calendar className="w-5 h-5 text-red-700" />}
                    iconBg="bg-red-100"
                    iconColor="text-red-700"
                    title="Important Dates"
                  >
                    <InfoField label="Depo of Plaintiff Date">
                      {caseDetails["depo_of_plaintiff_date"] || "Not scheduled"}
                    </InfoField>
                    <InfoField label="Mediation Date">
                      {caseDetails["mediation_date"] || "Not scheduled"}
                    </InfoField>
                    <InfoField label="Trial Date">
                      {caseDetails["trial_date"] || "Not scheduled"}
                    </InfoField>
                  </InfoCard>

                  {/* Financial Details */}
                  <InfoCard
                    icon={<DollarSign className="w-5 h-5 text-amber-700" />}
                    iconBg="bg-amber-100"
                    iconColor="text-amber-700"
                    title="Financial Details"
                  >
                    <InfoField label="PFS CRN 57 105 Status">
                      {caseDetails["pfs_crn_57_105_status"]}
                    </InfoField>
                    <InfoField label="PFS Received">
                      {caseDetails["pfs_received"]}
                    </InfoField>
                    <InfoField label="PFS Amount">
                      <span className="font-semibold text-lg text-gray-900">
                        {formattedTotalBillAmount}
                      </span>
                    </InfoField>
                    <InfoField label="Safe Harbor Letter Received">
                      {caseDetails["safe_harbor_letter_received"]}
                    </InfoField>
                  </InfoCard>
                </div>
              ) : (
                <Loader />
              )}
            </div>
          )}

          {/* DOCS TAB */}
          {activeTab === "docs" && (
            <div id="docs" role="tabpanel" aria-labelledby="docs">
              <div className="space-y-6">
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    disabled={selectedFiles.length === 0 || isDownloading}
                    onClick={handleDownload}
                    className={`flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black px-6 py-3 rounded-lg transition-all shadow-md hover:shadow-lg font-medium text-sm ${
                      selectedFiles.length === 0 || isDownloading
                        ? "opacity-50 pointer-events-none"
                        : ""
                    }`}
                  >
                    {isDownloading ? (
                      <>
                        <svg
                          aria-hidden="true"
                          className="inline w-4 h-4 animate-spin"
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
                        <Download className="w-4 h-4" />
                        Download File(s)
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
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-lg transition-all shadow-md hover:shadow-lg font-medium text-sm"
                  >
                    <Upload className="w-4 h-4" />
                    Upload File(s)
                  </button>
                </div>

                {/* Documents + Viewer Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Directory Tree */}
                  <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                    <div
                      className="p-4 overflow-y-auto overflow-x-hidden h-[550px]
                        [&::-webkit-scrollbar]:w-2
                        [&::-webkit-scrollbar-track]:rounded-full
                        [&::-webkit-scrollbar-track]:bg-gray-100
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        [&::-webkit-scrollbar-thumb]:bg-gray-300"
                    >
                      {isUploading ? (
                        <div className="flex items-center justify-center h-full">
                          <Loader />
                        </div>
                      ) : (
                        <>
                          <Toaster
                            toastOptions={{
                              success: { style: { background: "#f0fdf4" } },
                              error: { style: { background: "#fef2f2" } },
                            }}
                          />
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
                        </>
                      )}
                    </div>
                  </div>

                  {/* Document Viewer */}
                  <div className="lg:col-span-2">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl h-[550px] flex items-center justify-center overflow-hidden">
                      <Suspense fallback={<Loader />}>
                        {viewFileUrl ? (
                          <LazyDocumentViewer url={viewFileUrl} />
                        ) : (
                          <div className="text-center text-blue-400 p-8">
                            <svg
                              className="w-12 h-12 mx-auto mb-3 opacity-50"
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
                            <p className="font-semibold text-blue-900 mb-1">
                              Document Viewer
                            </p>
                            <p className="text-sm text-blue-700">
                              Click on any document to preview it here.
                            </p>
                          </div>
                        )}
                      </Suspense>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MESSAGES TAB */}

          {activeTab === "messages" && ( // ← add this condition
            <div id="messages" role="tabpanel" aria-labelledby="messages">
              <div className="space-y-6">
                <Messages />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Small helper components ─── */

const InfoCard: React.FC<{
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  children: React.ReactNode;
}> = ({ icon, iconBg, iconColor, title, children }) => (
  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-md border border-amber-100 hover:shadow-lg transition-shadow">
    <div className="flex items-center gap-3 mb-4">
      <div className={`p-2 ${iconBg} rounded-lg`}>
        <span className={`w-5 h-5 block ${iconColor}`}>{icon}</span>
      </div>
      <h3 className="font-semibold text-gray-900">{title}</h3>
    </div>
    <div className="space-y-3 text-sm">{children}</div>
  </div>
);

const InfoField: React.FC<{
  label: React.ReactNode;
  children: React.ReactNode;
}> = ({ label, children }) => (
  <div>
    <div className="text-xs text-gray-500 mb-1 flex items-center gap-1 uppercase tracking-wide">
      {label}
    </div>
    <div className="text-gray-900 font-medium">{children || "—"}</div>
  </div>
);

const FinalStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const cls =
    status === "CLOSED"
      ? "bg-gray-200 text-gray-800"
      : status === "OPEN"
        ? "bg-green-100 text-green-800"
        : "bg-blue-100 text-blue-800";
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${cls}`}
    >
      {status || "—"}
    </span>
  );
};

export default DetailCase;
