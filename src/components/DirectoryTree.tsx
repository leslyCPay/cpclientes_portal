import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../config";
import { HSAccordion, HSTreeView } from "preline";
import Loader from "./Loader";
import {
  Folder,
  File,
  ChevronRight,
  ChevronDown,
  Eye,
  Download,
} from "lucide-react";

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
    isSelected: boolean,
  ) => void;
  selectedFiles: { fileId: number; filename: string; filetype: string }[];
  onFileView: (attachmentId: number) => void;
}

interface DirectoryTreeProps {
  caseId: string | null | undefined;
  onFileSelect: (
    fileId: number,
    filename: string,
    filetype: string,
    isSelected: boolean,
  ) => void;
  selectedFiles: { fileId: number; filename: string; filetype: string }[];
  onFileView: (attachmentId: number) => void;
  refreshTree: boolean;
}

const TreeView: React.FC<TreeViewProps> = ({
  node,
  level = 0,
  onFileSelect,
  selectedFiles,
  onFileView,
}) => {
  const isFolder = !!node.children;
  const [isExpanded, setIsExpanded] = useState(true);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (node.file?.attachmentsid && onFileSelect) {
      onFileSelect(
        node.file.attachmentsid,
        node.file.filename,
        node.file.filetype,
        e.target.checked,
      );
    }
  };

  const handleFileClick = () => {
    if (node.file?.attachmentsid) {
      onFileView(node.file.attachmentsid);
    }
  };

  if (isFolder) {
    return (
      <div
        className="hs-accordion active"
        role="treeitem"
        aria-expanded={isExpanded}
        id={`hs-tree-heading-${node.name}`}
        data-hs-tree-view-item={JSON.stringify({
          value: node.name,
          isDir: true,
        })}
      >
        {/* Folder Row */}
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-amber-50 transition-colors rounded-lg text-left group hs-accordion-toggle"
          style={{ paddingLeft: `${1 + level * 1.5}rem` }}
          aria-expanded={isExpanded}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-amber-600 shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
          )}
          <Folder className="w-5 h-5 text-amber-500 shrink-0" />
          <span className="font-medium text-gray-700 group-hover:text-amber-700 text-sm flex-1 text-left">
            {node.name}
          </span>
          {node.children && (
            <span className="ml-auto text-xs text-gray-400 shrink-0">
              {node.children.length} items
            </span>
          )}
        </button>

        {/* Folder Children */}
        {isExpanded && (
          <div className="hs-accordion-content mt-1">
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
        )}
      </div>
    );
  }

  // File row
  const isChecked =
    !!node.file?.attachmentsid &&
    selectedFiles.some((file) => file.fileId === node.file?.attachmentsid);

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors rounded-lg group"
      style={{ paddingLeft: `${2.5 + level * 1.5}rem` }}
      role="treeitem"
      data-hs-tree-view-item={JSON.stringify({
        value: node.name,
        isDir: false,
      })}
    >
      <input
        type="checkbox"
        className="shrink-0 mt-0.5 w-4 h-4 border-gray-300 rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
        onChange={handleCheckboxChange}
        checked={isChecked}
      />
      <File className="w-4 h-4 text-blue-500 shrink-0" />
      <div className="flex-1 cursor-pointer" onClick={handleFileClick}>
        <span className="text-sm text-gray-700 group-hover:text-gray-900">
          {node.name}
        </span>
      </div>
      {/* Hover actions */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleFileClick}
          className="p-1.5 hover:bg-blue-100 rounded-md text-blue-600 transition-colors"
          title="Preview"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </div>
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

  const fetchDocuments = async (caseId: string | null | undefined) => {
    if (!caseId) return;

    setMessage("");
    setLoading(true);

    try {
      const response = await axios.get(
        `${BASE_URL}/api/documents-case?case_id=${caseId}`,
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
      if (!parent.children) parent.children = [];

      if (item.filename) {
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
            const folderNode: TreeNode = { name: key, children: [] };
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
        const folderNode: TreeNode = { name: key, children: [] };
        root.children!.push(folderNode);
        processItem(data[key], folderNode);
      }
    });

    return root;
  };

  if (!directoryTree) return <Loader />;

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

      {message && !loading && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <File className="w-12 h-12 mb-3 opacity-50" />
          <p className="text-sm">{message}</p>
        </div>
      )}

      {!loading && !message && (
        <div className="space-y-1">
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
      )}
    </div>
  );
};

export default DirectoryTree;
