import React from "react";

interface DocumentViewerProps {
  url: string; // The URL of the file to display
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ url }) => {
  return (
    <iframe
      title="Document Viewer"
      src={`https://docs.google.com/viewer?url=${url}&embedded=true`}
      width="100%"
      height="600"
    />
  );
};

export default DocumentViewer;
