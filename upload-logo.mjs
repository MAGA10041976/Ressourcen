import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL;
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY;

if (!FORGE_API_URL || !FORGE_API_KEY) {
  console.error("Missing BUILT_IN_FORGE_API_URL or BUILT_IN_FORGE_API_KEY");
  process.exit(1);
}

async function uploadLogo() {
  const logoPath = "/home/ubuntu/upload/ZETA-Logo.png";
  const fileBuffer = fs.readFileSync(logoPath);
  const relKey = "assets/zeta-logo.png";

  const baseUrl = FORGE_API_URL.endsWith("/") ? FORGE_API_URL : FORGE_API_URL + "/";
  const uploadUrl = new URL("v1/storage/upload", baseUrl);
  uploadUrl.searchParams.set("path", relKey);

  const blob = new Blob([fileBuffer], { type: "image/png" });
  const form = new FormData();
  form.append("file", blob, "zeta-logo.png");

  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: { Authorization: `Bearer ${FORGE_API_KEY}` },
    body: form,
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Upload failed:", response.status, text);
    process.exit(1);
  }

  const result = await response.json();
  console.log("Logo uploaded successfully!");
  console.log("URL:", result.url);
}

uploadLogo();
