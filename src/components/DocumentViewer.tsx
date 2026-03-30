import React from "react";

interface DocumentViewerProps {
  url: string;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ url }) => {
  const encodedUrl = encodeURIComponent(url);
  return (
    <iframe
      title="Document Viewer"
      src={`https://docs.google.com/viewer?url=${encodedUrl}&embedded=true`}
      width="100%"
      height="100%"
      className="rounded-lg"
      style={{ minHeight: "540px", border: "none" }}
    />
  );
};

export default DocumentViewer;
