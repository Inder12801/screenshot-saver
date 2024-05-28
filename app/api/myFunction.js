export default async (req, res) => {
  // Set CORS headers to allow all origins
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.end();
    return;
  }

  // Your function logic here
  return res.json({ message: "Hello, world!" });
};
