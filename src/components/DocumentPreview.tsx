import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { FileText, Eye, X } from "lucide-react";
import { DocumentFile, DocumentFolder } from "";

interface DocumentPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  documents: DocumentFolder[];
  hasConfirmed: boolean;
  requiresConfirmation?: boolean;
}

export function DocumentPreview({
  isOpen,
  onClose,
  onConfirm,
  documents,
  hasConfirmed,
  requiresConfirmation = false,
}: DocumentPreviewProps) {
  const [selectedDocument, setSelectedDocument] = useState<DocumentFile | null>(
    null,
  );
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Extract required documents
  const getDocumentByFolderName = (folderName: string) => {
    const folder = documents.find((d) => d.name === folderName);
    return folder?.children[0] as DocumentFile | undefined;
  };

  const allDocuments = [
    {
      label: "Retainer Agreement",
      doc: getDocumentByFolderName("Attorney Retainer"),
    },
    { label: "LOP", doc: getDocumentByFolderName("LOP") },
    {
      label: "Provider Invoices",
      doc: getDocumentByFolderName("Provider Invoices"),
    },
    {
      label: "Intake Response",
      doc: getDocumentByFolderName("Intake Response"),
    },
    { label: "Loss Affidavit", doc: getDocumentByFolderName("Loss Affidavit") },
  ];

  // Filter out "Intake Response" when requiresConfirmation is false (View Submitted Documents)
  const requiredDocuments = requiresConfirmation
    ? allDocuments
    : allDocuments.filter((item) => item.label !== "Intake Response");

  const handleConfirm = () => {
    if (agreedToTerms) {
      onConfirm();
      onClose();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-gray-900">
              Required Documents Review
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 mt-2">
              Please review all documents below and confirm your agreement
              before accessing case details.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6">
            {/* Document List */}
            <div className="space-y-3 mb-6">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                Documents Available for Review
              </h3>
              {requiredDocuments.map((item, index) =>
                item.doc ? (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {item.label}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.doc.name}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {item.doc.size}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedDocument(item.doc)}
                      className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow-md"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-medium">Preview</span>
                    </button>
                  </div>
                ) : null,
              )}
            </div>

            {/* Confirmation Section - Only show when requiresConfirmation is true */}
            {requiresConfirmation && !hasConfirmed && (
              <div className="border-t border-gray-200 pt-6">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Confirmation Declaration
                  </h3>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1 w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-gray-700 text-sm">
                      I hereby confirm that I have read, reviewed, and agree to
                      all the information mentioned in the documents listed
                      above. I understand that by confirming this, I acknowledge
                      the terms and conditions outlined in these documents.
                    </span>
                  </label>
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={onClose}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={!agreedToTerms}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${
                      agreedToTerms
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black shadow-md hover:shadow-lg"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}

            {requiresConfirmation && hasConfirmed && (
              <div className="border-t border-gray-200 pt-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <p className="text-green-800 font-medium">
                    ✓ You have confirmed and agreed to all required documents
                  </p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Document Preview Modal - Separate, on top of everything */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-8">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-white flex-shrink-0">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  {selectedDocument.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  File size: {selectedDocument.size}
                </p>
              </div>
              <button
                onClick={() => setSelectedDocument(null)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 min-h-[800px] p-12">
                <div className="text-center text-gray-500 space-y-6">
                  <FileText className="w-20 h-20 mx-auto text-amber-500" />
                  <p className="text-2xl font-medium text-gray-700">
                    Document Preview
                  </p>
                  <p className="text-lg text-gray-600">
                    <strong>{selectedDocument.name}</strong>
                  </p>
                  <div className="mt-12 text-left max-w-4xl mx-auto space-y-4">
                    <p className="text-gray-600 leading-relaxed">
                      In a production environment, this area would display the
                      actual document content. The document would be rendered
                      here for full review, allowing users to scroll through all
                      pages and examine the details before confirmation.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      This preview window provides ample space to view documents
                      in their entirety, ensuring users can thoroughly review
                      all information before making decisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
