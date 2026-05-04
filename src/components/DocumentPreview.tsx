import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { FileText, Eye, X, Loader2 } from "lucide-react";
import BASE_URL from "../config";
import axios from "axios";

interface DocumentFile {
  id: string;
  name: string;
  type: "file";
  attachmentsid: number;
  filetype: string;
  document_type_path: string;
}

interface DocumentFolder {
  id: string;
  name: string;
  type: "folder";
  children: (DocumentFolder | DocumentFile)[];
}

interface DocumentPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  caseID: string;
  hasConfirmed: boolean;
  requiresConfirmation?: boolean;
  recordID: string;
}

// ✅ Recursively flatten the nested API response into DocumentFolder[]
function parseApiResponse(data: Record<string, any>): DocumentFolder[] {
  const parseNode = (
    key: string,
    value: any,
    parentPath = "",
  ): DocumentFolder | DocumentFile => {
    // It's a file entry (array of file objects at leaf level)
    if (Array.isArray(value)) {
      // Return a folder whose children are files
      const folder: DocumentFolder = {
        id: `${parentPath}/${key}`,
        name: key,
        type: "folder",
        children: value.map((file: any) => ({
          id: String(file.attachmentsid),
          name: file.filename,
          type: "file" as const,
          attachmentsid: file.attachmentsid,
          filetype: file.filetype,
          document_type_path: file.document_type_path,
        })),
      };
      return folder;
    }

    // It's a nested folder object
    const folder: DocumentFolder = {
      id: `${parentPath}/${key}`,
      name: key,
      type: "folder",
      children: Object.entries(value).map(([childKey, childValue]) =>
        parseNode(childKey, childValue, `${parentPath}/${key}`),
      ),
    };
    return folder;
  };

  return Object.entries(data).map(([key, value]) =>
    parseNode(key, value),
  ) as DocumentFolder[];
}

// ✅ Search recursively through nested folders for a folder by name
function findFolderByName(
  folders: (DocumentFolder | DocumentFile)[],
  name: string,
): DocumentFolder | undefined {
  for (const node of folders) {
    if (node.type === "folder") {
      if (node.name === name) return node;
      const found = findFolderByName(node.children, name);
      if (found) return found;
    }
  }
  return undefined;
}

export function DocumentPreview({
  isOpen,
  onClose,
  onConfirm,
  caseID,
  hasConfirmed,
  requiresConfirmation = false,
  recordID,
}: DocumentPreviewProps) {
  const [documents, setDocuments] = useState<DocumentFolder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<DocumentFile | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  //Fetch documents when dialog opens
  useEffect(() => {
    if (!isOpen || !caseID) return;

    const fetchDocs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `${BASE_URL}/api/submittedocs?case_id=${caseID}`,
        );
        console.log(res);
        const parsed = parseApiResponse(res.data);
        setDocuments(parsed);
      } catch (err) {
        setError("Failed to load documents. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [isOpen, caseID]);

  // Map label → folder name (matches your API response keys)
  const folderMappings: { label: string; folderName: string }[] = [
    { label: "Retainer Agreement", folderName: "Attorney Retainer" },
    { label: "Letter Of Protection", folderName: "LOP" },
    {
      label: "Provider Invoices",
      folderName: "Final Invoice - Provider",
    },
    { label: "Loss Affidavit", folderName: "Affidavit of Loss" },
    { label: "Intake Response", folderName: "REPORTS" },
  ];

  const allDocuments = folderMappings.map(({ label, folderName }) => {
    const folder = findFolderByName(documents, folderName);
    const firstFile = folder?.children.find((c) => c.type === "file") as
      | DocumentFile
      | undefined;
    return { label, doc: firstFile ?? null };
  });

  const requiredDocuments = requiresConfirmation
    ? allDocuments
    : allDocuments.filter((item) => item.label !== "Intake Response");

  const handleConfirm = async () => {
    if (!agreedToTerms) return;
    try {
      await axios.post(`${BASE_URL}/change-status?record_id=${recordID}`);
      onConfirm();
      onClose();
    } catch (err) {
      setError("Failed to update status. Please try again.");
    }
  };

  //Build the preview URL using attachmentsid
  const getPreviewUrl = (file: DocumentFile) =>
    `${BASE_URL}/api/documents/preview/${file.attachmentsid}`;

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
            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12 text-gray-500">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span>Loading documents...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Document List */}
            {!loading && !error && (
              <div className="space-y-3 mb-6">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Documents Available for Review
                </h3>

                {requiredDocuments.every((item) => !item.doc) && (
                  <p className="text-sm text-gray-400 text-center py-6">
                    No documents found for this case.
                  </p>
                )}

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
                          {/* <div className="text-xs text-gray-400 mt-1">
                            {item.doc.document_type_path}
                          </div> */}
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedFile(item.doc)}
                        className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow-md"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-medium">Preview</span>
                      </button>
                    </div>
                  ) : null,
                )}
              </div>
            )}

            {/* Confirmation Section */}
            {!loading && requiresConfirmation && !hasConfirmed && (
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

      {/* ✅ PDF Preview Modal */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-8">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-white flex-shrink-0">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  {selectedFile.name}
                </h3>
                {/* <p className="text-sm text-gray-500 mt-1">
                  {selectedFile.document_type_path}
                </p> */}
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden">
              <iframe
                src={`https://docs.google.com/viewer?url=${getPreviewUrl(selectedFile)}&embedded=true`}
                className="w-full h-full border-0"
                title={selectedFile.name}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
