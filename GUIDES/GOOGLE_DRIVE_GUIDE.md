# Google Drive Image Integration Guide

## Overview
This project now supports Google Drive image links for project photos. The system automatically converts Google Drive sharing links into embeddable image URLs.

## Supported Google Drive Link Formats

The system recognizes these Google Drive link formats:

1. **File View Format:**
   ```
   https://drive.google.com/file/d/FILE_ID/view
   ```

2. **Open Format:**
   ```
   https://drive.google.com/open?id=FILE_ID
   ```

3. **Direct Format:**
   ```
   https://drive.google.com/d/FILE_ID
   ```

4. **Complex Format:**
   ```
   https://drive.google.com/file/d/FILE_ID/view?usp=drive_link&resourcekey=KEY
   ```

## How to Use

### 1. Add Photo URLs to Project Posts

In your project posts, add a `photoUrl` field with a Google Drive link:

```typescript
{
    id: "project-1",
    title: "My Project",
    content: "Project description...",
    author: "Author Name",
    createdAt: "2024-01-01T00:00:00Z",
    tags: ["photo", "project"],
    photoUrl: "https://drive.google.com/file/d/YOUR_FILE_ID/view"
}
```

### 2. Automatic Conversion

The system automatically:
- Extracts the file ID from your Google Drive link
- Converts it to an embeddable URL: `https://drive.google.com/uc?export=view&id=YOUR_FILE_ID`
- Falls back to a default image if the link is invalid

### 3. Example Implementation

```typescript
// The system automatically handles this conversion
const photos = post.tags.includes('photo') ? [
    {
        url: getGoogleDriveImageUrl(post.photoUrl),
        alt: post.title,
        title: post.title
    }
] : [];
```

## Important Notes

### Google Drive Sharing Settings
Make sure your Google Drive images are set to "Anyone with the link can view" for them to be accessible.

### Image Size and Performance
- Google Drive images are served through Google's CDN
- Large images may take time to load
- Consider optimizing image sizes before uploading to Drive

### Fallback Images
If no `photoUrl` is provided or the link is invalid, the system uses a default Unsplash image.

## Testing

You can test the functionality using the provided test file:

```bash
node test-google-drive.js
```

## Troubleshooting

### Common Issues

1. **Image Not Loading:**
   - Check if the Google Drive link is publicly accessible
   - Verify the file ID is correctly extracted
   - Ensure the image format is supported (JPG, PNG, etc.)

2. **Permission Denied:**
   - Make sure the Google Drive file is shared with "Anyone with the link can view"
   - Check if the file hasn't been deleted or moved

3. **Invalid URL Format:**
   - Use one of the supported Google Drive link formats
   - Ensure the URL is complete and properly formatted

## Security Considerations

- Only share images that are meant to be public
- Be cautious with sensitive content
- Consider using Google Drive's built-in privacy controls
- The system only extracts file IDs and doesn't store the original sharing links

## Future Enhancements

Potential improvements could include:
- Support for Google Drive folders
- Image caching and optimization
- Multiple image support per project
- Integration with Google Drive API for better control
