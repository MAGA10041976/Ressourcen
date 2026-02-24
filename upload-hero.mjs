import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL;
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY;

if (!FORGE_API_URL || !FORGE_API_KEY) {
  console.error("Missing BUILT_IN_FORGE_API_URL or BUILT_IN_FORGE_API_KEY");
  process.exit(1);
}

async function uploadFile(localPath, relKey, contentType) {
  const fileBuffer = fs.readFileSync(localPath);
  const baseUrl = FORGE_API_URL.endsWith("/") ? FORGE_API_URL : FORGE_API_URL + "/";
  const uploadUrl = new URL("v1/storage/upload", baseUrl);
  uploadUrl.searchParams.set("path", relKey);

  const blob = new Blob([fileBuffer], { type: contentType });
  const form = new FormData();
  form.append("file", blob, relKey.split("/").pop());

  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: { Authorization: `Bearer ${FORGE_API_KEY}` },
    body: form,
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`Upload failed for ${relKey}:`, response.status, text);
    return null;
  }

  const result = await response.json();
  console.log(`Uploaded ${relKey}: ${result.url}`);
  return result.url;
}

async function main() {
  await uploadFile(
    "/home/ubuntu/webdev-static-assets/hero-automation.jpg",
    "assets/hero-automation.jpg",
    "image/jpeg"
  );
}

main();
