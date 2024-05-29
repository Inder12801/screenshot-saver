"use client";
import { useState } from "react";
import axios from "axios";

const ScreenshotComponent = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  const handleCapture = async () => {
    if (url === "") {
      alert("Please Enter Url");
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post(
        apiURL + "/screenshot",
        { url: url },
        {
          responseType: "blob",
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
        alert("Failed to capture screenshots");
        return;
      }
    } catch (error) {
      alert("Error capturing screenshots:", error);
      return;
    }

    setLoading(false);
    return;
  };

  return (
    <div className="mt-10 flex flex-col items-center justify-center gap-6  w-2/3">
      <h1 className="text-center text-cyan-500 text-4xl font-extrabold ">
        Save time with taking screenshot!
      </h1>
      <h3 className="text-center">
        Enter the URL of your website and click on the button to capture
        screenshots.
      </h3>
      <div className="w-[80%] m-auto flex justify-center  ">
        <input
          className="text-zinc-800 text-xl  lg:p-2 lg:px-6 border-none outline-none rounded-tl-3xl rounded-bl-3xl"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL of your website"
        />
        <button
          className="bg-cyan-600 text-xl   p-2 rounded-tr-3xl rounded-br-3xl"
          onClick={handleCapture}
          disabled={loading}
        >
          {loading ? "Capturing..." : "Capture Screenshots"}
        </button>
      </div>
    </div>
  );
};

export default ScreenshotComponent;
