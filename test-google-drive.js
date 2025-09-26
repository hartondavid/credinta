// Test pentru funcționalitatea Google Drive
import { extractGoogleDriveId, getGoogleDriveImageUrl } from './src/components/pages/projects/projectPosts.ts';

// Teste pentru diferite formate de link-uri Google Drive
const testUrls = [
    "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view",
    "https://drive.google.com/open?id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
    "https://drive.google.com/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
    "https://drive.google.com/file/d/0ByI6JZW8VVPheDlON0o0ck41Vms/view?usp=drive_link&resourcekey=0-xq1u1f2hu01pwUFOIgf_aw"
];

console.log("=== Test Google Drive Functionality ===\n");

testUrls.forEach((url, index) => {
    console.log(`Test ${index + 1}:`);
    console.log(`Original URL: ${url}`);

    const driveId = extractGoogleDriveId(url);
    console.log(`Extracted ID: ${driveId}`);

    const imageUrl = getGoogleDriveImageUrl(url);
    console.log(`Image URL: ${imageUrl}`);

    console.log("---");
});

// Test cu URL invalid
console.log("Test cu URL invalid:");
console.log(`Image URL: ${getGoogleDriveImageUrl("https://invalid-url.com")}`);

// Test cu fallback ID
console.log("\nTest cu fallback ID:");
console.log(`Image URL: ${getGoogleDriveImageUrl(undefined, "0ByI6JZW8VVPheDlON0o0ck41Vms")}`);
