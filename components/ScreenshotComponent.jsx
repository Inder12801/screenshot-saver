"use client";
import { useState } from "react";
import axios from "axios";

const ScreenshotComponent = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCapture = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        "https://screenshot-saver.vercel.app/api/screenshot",
        { url },
        {
          headers: {
            "Content-Type": "application/blob",
          },
        }
      );

      if (response.status === 200) {
        const blob = response.data;
        const downloadUrl = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", "screenshots.zip");
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        console.error("Failed to capture screenshots");
      }
    } catch (error) {
      console.error("Error capturing screenshots:", error);
    }

    setLoading(false);
  };

  return (
    <div className="mt-10">
      <input
        className="text-zinc-800 p-1 border-none outline-none"
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL"
      />
      <button
        className="bg-cyan-600 p-1"
        onClick={handleCapture}
        disabled={loading}
      >
        {loading ? "Capturing..." : "Capture Screenshots"}
      </button>
    </div>
  );
};

export default ScreenshotComponent;
