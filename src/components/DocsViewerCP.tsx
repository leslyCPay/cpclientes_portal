import { useEffect, useRef, useState } from "react";

interface PdfViewerComponentProps {
  document: string; // The document URL or path
}

export default function PdfViewerComponent(props: PdfViewerComponentProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    let instance: any = null;

    (async function () {
      try {
        if (!container) {
          throw new Error("Container element not found.");
        }

        // Dynamically import PSPDFKit
        const PSPDFKit = await import("pspdfkit");

        // Unload any existing instance
        if (PSPDFKit.unload) {
          PSPDFKit.unload(container);
        }

        // Load the PSPDFKit instance
        instance = await PSPDFKit.load({
          container,
          document: props.document,
          baseUrl: `${window.location.protocol}//${window.location.host}/${
            import.meta.env.BASE_URL
          }`,
        });
      } catch (error) {
        console.error("Error loading PSPDFKit:", error);
        setError("Failed to load the document viewer.");
      }
    })();

    // Cleanup function to unload PSPDFKit when the component unmounts
    return () => {
      if (container) {
        import("pspdfkit").then((PSPDFKit) => {
          if (PSPDFKit.unload) {
            PSPDFKit.unload(container);
          }
        });
      }
    };
  }, [props.document]);

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
}
