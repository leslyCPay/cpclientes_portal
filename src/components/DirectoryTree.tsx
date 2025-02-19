import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../config";
import { HSAccordion, HSTreeView } from "preline";
import { handleApiError } from "../utils/apiErrorHandler";
import Loader from "./Loader";

interface TreeNode {
  name: string;
  children?: TreeNode[];
  file?: {
    filename: string;
    filetype: string;
    documenttypeid: number;
    document_type_path: string;
    attachmentsid: number;
  };
}

interface TreeViewProps {
  node: TreeNode;
  level?: number;
  onFileSelect?: (
    fileId: number,
    filename: string,
    filetype: string,
    isSelected: boolean
  ) => void;
  selectedFiles: { fileId: number; filename: string; filetype: string }[];
  onFileView: (attachmentId: number) => void; // Callback for viewing a file
}

interface DirectoryTreeProps {
  caseId: string | null;
  onFileSelect: (
    fileId: number,
    filename: string,
    filetype: string,
    isSelected: boolean
  ) => void;
  selectedFiles: { fileId: number; filename: string; filetype: string }[];
  onFileView: (attachmentId: number) => void; // Callback for viewing a file
  refreshTree: boolean; // Add refreshTree prop
}

const TreeView: React.FC<TreeViewProps> = ({
  node,
  level = 0,
  onFileSelect,
  selectedFiles,
  onFileView,
}) => {
  const isFolder = !!node.children;

  // Function to get the file icon based on the file extension
  const getFileIcon = (filename: string) => {
    const extension = filename.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return (
          <svg
            className="shrink-0 size-6 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <path d="M14 2v6h6"></path>
            <path d="M10 13v-1h4v1"></path>
            <path d="M10 16v-1h4v1"></path>
            <path d="M10 19v-1h4v1"></path>
          </svg>
        );
      case "docx":
        return (
          <svg
            className="shrink-0 size-6 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <path d="M14 2v6h6"></path>
            <path d="M12 13v-1h4v1"></path>
            <path d="M12 16v-1h4v1"></path>
            <path d="M12 19v-1h4v1"></path>
          </svg>
        );
      case "css":
        return (
          <svg
            className="shrink-0 size-6 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
            <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
          </svg>
        );
      default:
        return (
          <svg
            className="shrink-0 size-6 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
            <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
          </svg>
        );
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (node.file?.attachmentsid && onFileSelect) {
      onFileSelect(
        node.file.attachmentsid,
        node.file.filename,
        node.file.filetype,
        e.target.checked
      );
    }
  };

  const handleFileClick = () => {
    if (node.file?.attachmentsid) {
      onFileView(node.file.attachmentsid); // Call the onFileView callback with the attachment ID
    }
  };

  return (
    <>
      {isFolder ? (
        <div
          className="hs-accordion active"
          role="treeitem"
          aria-expanded="true"
          id="hs-multiple-selection-tree-heading-one"
          data-hs-tree-view-item={JSON.stringify({
            value: node.name,
            isDir: isFolder,
          })}
        >
          {/* Folder/File Heading */}
          <div className="hs-accordion-heading py-0.5 flex items-center gap-x-0.5 w-full hs-tree-view-selected:bg-gray-100 dark:hs-tree-view-selected:bg-neutral-700">
            {isFolder && (
              <button
                className="hs-accordion-toggle flex justify-center items-center hover:bg-gray-100 rounded-md focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                aria-expanded="true"
              >
                <svg
                  className="size-6 text-gray-800 dark:text-neutral-200"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14"></path>
                  <path
                    className="hs-accordion-active:hidden block"
                    d="M12 5v14"
                  ></path>
                </svg>
              </button>
            )}

            <div className="grow hs-tree-view-selected:bg-gray-100 dark:hs-tree-view-selected:bg-neutral-700 px-1.5 rounded-md cursor-pointer">
              <div className="flex items-center gap-x-3">
                <svg
                  className="shrink-0 size-6 text-gray-500 dark:text-neutral-500"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
                </svg>
                <div className="grow">
                  <span className="text-sm text-gray-800 dark:text-neutral-200">
                    {node.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Folder Children */}
          <div className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300">
            <div className="ps-7 relative before:absolute before:top-0 before:start-3 before:w-0.5 before:-ms-px before:h-full before:bg-gray-100 dark:before:bg-neutral-700">
              {node?.children?.map((child, index) => (
                <TreeView
                  key={index}
                  node={child}
                  level={level + 1}
                  onFileSelect={onFileSelect}
                  selectedFiles={selectedFiles}
                  onFileView={onFileView}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        // File Item
        <div
          className="hs-tree-view-selected:bg-gray-100 px-2 rounded-md cursor-pointer"
          role="treeitem"
          data-hs-tree-view-item={JSON.stringify({
            value: node.name,
            isDir: false,
          })}
        >
          <div className="flex items-center gap-x-3">
            <input
              type="checkbox"
              className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
              onChange={handleCheckboxChange}
              checked={
                !!node.file?.attachmentsid &&
                selectedFiles.some(
                  (file) => file.fileId === node.file?.attachmentsid
                )
              }
            />
            {getFileIcon(node.name)}
            <div className="grow" onClick={handleFileClick}>
              <span className="text-sm text-gray-800 dark:text-neutral-200">
                {node.name}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const DirectoryTree: React.FC<DirectoryTreeProps> = ({
  caseId,
  onFileSelect,
  selectedFiles,
  onFileView,
  refreshTree,
}) => {
  const [directoryTree, setDirectoryTree] = useState<TreeNode | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDocuments = async (caseId: string | null) => {
    if (!caseId) {
      //setMessage("Case ID is null");
      return;
    }

    setMessage("");

    setLoading(true);

    try {
      const response = await axios.get(
        `${BASE_URL}/api/documents-case?case_id=${caseId}`
      );

      if (Object.keys(response.data).length === 0) {
        setMessage("There's no documents to show");
      }

      const transformedData: TreeNode = transformResponseToTree(response.data);
      setDirectoryTree(transformedData);
    } catch (error) {
      const transformedData: TreeNode = transformResponseToTree({});
      setDirectoryTree(transformedData);
      setMessage("There's no documents to show");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments(caseId);
  }, [caseId, refreshTree]);

  useEffect(() => {
    if (directoryTree) {
      HSAccordion.autoInit();
      HSTreeView.autoInit();
    }
  }, [directoryTree]);

  const transformResponseToTree = (data: any): TreeNode => {
    const root: TreeNode = { name: "root", children: [] };

    const processItem = (item: any, parent: TreeNode) => {
      if (!parent.children) {
        parent.children = [];
      }

      if (item.filename) {
        // This is a file
        parent.children.push({
          name: item.filename,
          file: {
            filename: item.filename,
            filetype: item.filetype,
            documenttypeid: item.documenttypeid,
            document_type_path: item.document_type_path,
            attachmentsid: item.attachmentsid,
          },
        });
      } else if (Array.isArray(item)) {
        item.forEach((child) => processItem(child, parent));
      } else if (typeof item === "object") {
        Object.keys(item).forEach((key) => {
          if (!isNaN(Number(key))) {
            processItem(item[key], parent);
          } else {
            const folderName = key;
            const folderNode: TreeNode = { name: folderName, children: [] };
            parent?.children?.push(folderNode);
            processItem(item[key], folderNode);
          }
        });
      }
    };

    Object.keys(data).forEach((key) => {
      if (!isNaN(Number(key))) {
        processItem(data[key], root);
      } else {
        const folderName = key;
        const folderNode: TreeNode = { name: folderName, children: [] };
        root.children!.push(folderNode);
        processItem(data[key], folderNode);
      }
    });

    return root;
  };

  if (!directoryTree) {
    return <Loader />;
  }

  return (
    <div
      id="hs-tree-view-checkbox"
      role="tree"
      aria-orientation="vertical"
      data-hs-tree-view='{
      "controlBy": "checkbox",
      "autoSelectChildren": true
    }'
    >
      {loading && <Loader />}
      {message && (
        <span className="error text-md mt-5 block text-left">{message}</span>
      )}
      {directoryTree?.children?.map((child, index) => (
        <TreeView
          key={index}
          node={child}
          onFileSelect={onFileSelect}
          selectedFiles={selectedFiles}
          onFileView={onFileView}
        />
      ))}
    </div>
  );
};

export default DirectoryTree;
