"use client";
import axios from "axios";
import React, { useState } from "react";

const Main = () => {
  const [url, setUrl] = useState("");

  const handleSS = async () => {
    try {
      const res = await axios.post("/api/screenshot", {
        url: url,
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  const handleClick = () => {
    if (url !== "") {
      handleSS().then((data) => {
        const img = document.createElement("img");
        img.src = `data:image/png;base64,${data}`;
        document.body.appendChild(img);
      });
    } else alert("Please Enter Url");
  };

  return (
    <div className="w-full gap-2 flex">
      <input
        type="text"
        placeholder="Paste Url of Your Website"
        className="p-2 text-green-800"
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
        }}
      />
      <button className="bg-blue-500 p-2" onClick={() => handleClick()}>
        Go
      </button>
    </div>
  );
};

export default Main;
