import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, FileText, MessageSquare } from "lucide-react";
import { DocumentPreview } from "./DocumentPreview";

interface Props {
  case_id: string;
  case_number: string;
  claim_number: string;
  status: string;
  final_status: string;
  documents?: any[];
  [key: string]: any;
}

const CaseInformation: React.FC<{ arepons: Props }> = ({ arepons }) => {
  const navigate = useNavigate();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [requiresConfirmation, setRequiresConfirmation] = useState(false);
  const [hasConfirmed, setHasConfirmed] = useState(false);

  const goToCaseDetails = (
    caseId: string,
    activeTab: string = "info",
    state: string = "",
    record_id: string = "",
  ) => {
    sessionStorage.setItem("record_id", record_id);
    navigate(`/detail-case/${caseId}?tab=${activeTab}`, {
      state: { state },
    });
  };

  const handleViewDocs = (needsConfirmation: boolean) => {
    setRequiresConfirmation(needsConfirmation);
    setPreviewOpen(true);
  };

  const handleConfirm = () => {
    setHasConfirmed(true);
  };

  // Statuses that show "View Submitted Documents" (blue)
  const isViewDocsStatus =
    arepons.status === "Claim to be filed" ||
    arepons.status === "Pending Ratification" ||
    arepons.status === "New Case Entered";

  // Statuses that show "Confirm Submitted Information" (teal)
  const isConfirmStatus =
    arepons.status === "Welcome Call Done - Pending HO Confirmation";

  // Statuses that show the classic View + Docs + Message icons
  const isIconOnlyStatus =
    arepons.status === "SETTLED - Awaiting Release" ||
    arepons.status === "Ready for Litigation";

  return (
    <>
      <div
        className="px-6 py-5 hover:bg-amber-50/50 transition-colors"
        key={arepons.case_id}
      >
        <div className="grid grid-cols-12 gap-4 items-center">
          {/* Case ID */}
          <div className="col-span-2">
            <div className="font-semibold text-gray-900 uppercase text-sm">
              {arepons.case_id}
            </div>
            {arepons.final_status && (
              <div className="text-xs text-gray-500 mt-1 font-mono">
                {arepons.final_status}
              </div>
            )}
          </div>

          {/* Stage */}
          <div className="col-span-2">
            <div className="font-semibold text-gray-900 uppercase text-sm">
              {arepons.stage}
            </div>
            {arepons.case_number && (
              <div className="text-xs text-gray-500 mt-1 font-mono">
                #{arepons.case_number}
              </div>
            )}
          </div>

          {/* Claim Number */}
          <div className="col-span-2">
            <div className="text-gray-700 font-mono text-sm">
              {arepons.claim_number}
            </div>
          </div>

          {/* Status */}
          <div className="col-span-2">
            <span
              className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                arepons.status === "New Case Entered"
                  ? "bg-blue-100 text-blue-800"
                  : arepons.status === "Presuit - Demand Sent"
                    ? "bg-yellow-100 text-yellow-400"
                    : arepons.status === "SETTLED - Awaiting Release"
                      ? "bg-purple-100 text-purple-400"
                      : arepons.status === "10-Day Demand - Paid Through Client"
                        ? "bg-orange-100 text-orange-500"
                        : arepons.status === "Ready for Litigation"
                          ? "bg-indigo-100 text-indigo-800"
                          : arepons.status ===
                              "SETTLED - Global Awaiting Release"
                            ? "bg-teal-100 text-teal-800"
                            : "bg-green-100 text-green-800"
              }`}
            >
              {arepons.status}
            </span>
          </div>

          {/* Actions */}
          <div className="col-span-4 flex justify-end gap-2">
            {isConfirmStatus ? (
              // Teal — "Confirm Submitted Information"
              <button
                type="button"
                onClick={() => handleViewDocs(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow-md text-sm font-medium"
              >
                <FileText className="w-4 h-4" />
                <span>Confirm Submitted Information</span>
              </button>
            ) : isViewDocsStatus ? (
              // Blue — "View Submitted Documents"
              <button
                type="button"
                onClick={() => handleViewDocs(false)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow-md text-sm font-medium"
              >
                <FileText className="w-4 h-4" />
                <span>View Submitted Documents</span>
              </button>
            ) : (
              // Default — View + Docs icon + Messages icon
              <>
                <button
                  onClick={() =>
                    goToCaseDetails(
                      arepons.case_id,
                      "info",
                      arepons.state,
                      arepons.id,
                    )
                  }
                  type="button"
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow-md text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    goToCaseDetails(
                      arepons.case_id,
                      "docs",
                      arepons.state,
                      arepons.id,
                    )
                  }
                  className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow-md"
                >
                  <FileText className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    goToCaseDetails(
                      arepons.case_id,
                      "messages",
                      arepons.state,
                      arepons.id,
                    )
                  }
                  className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow-md"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Document Preview Modal */}
      <DocumentPreview
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        onConfirm={handleConfirm}
        caseID={arepons.case_id}
        hasConfirmed={hasConfirmed}
        requiresConfirmation={requiresConfirmation}
        recordID={arepons.id}
      />
    </>
  );
};

export default CaseInformation;
