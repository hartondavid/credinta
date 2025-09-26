// Cloudinary service utility for managing private images
export interface CloudinaryImage {
    publicId: string;
    url: string;
    secureUrl: string;
    width: number;
    height: number;
    format: string;
    resourceType: string;
}

// Cloudinary configuration
const CLOUDINARY_CONFIG = {
    cloudName: 'drtkpapql', // Replace with your cloud name
    apiKey: '338311426474968',       // Replace with your API key
    apiSecret: '2ubvCrA1JrUYg8O_KVdsT14bsLQ', // Replace with your API secret
    uploadPreset: 'calarasi-warriors' // Replace with your upload preset
};

// Generate Cloudinary URL for private images
export const getCloudinaryImageUrl = (
    publicId: string,
    options: {
        width?: number;
        height?: number;
        crop?: 'fill' | 'scale' | 'fit' | 'thumb';
        quality?: 'auto' | 'low' | 'good' | 'best';
        format?: 'auto' | 'jpg' | 'png' | 'webp';
    } = {}
): string => {
    const { width, height, crop = 'fill', quality = 'auto', format = 'auto' } = options;

    let url = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload`;

    // Add transformation parameters
    const transformations = [];

    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    transformations.push(`c_${crop}`);
    transformations.push(`q_${quality}`);
    if (format !== 'auto') transformations.push(`f_${format}`);

    if (transformations.length > 0) {
        url += `/${transformations.join(',')}`;
    }

    url += `/${publicId}`;

    return url;
};

// Generate thumbnail URL
export const getCloudinaryThumbnailUrl = (publicId: string, size: number = 300): string => {
    return getCloudinaryImageUrl(publicId, {
        width: size,
        height: size,
        crop: 'thumb',
        quality: 'good'
    });
};

// Generate optimized image URL for web
export const getCloudinaryWebUrl = (publicId: string, width: number = 800): string => {
    return getCloudinaryImageUrl(publicId, {
        width,
        height: Math.round(width * 0.75), // 4:3 aspect ratio
        crop: 'fill',
        quality: 'auto',
        format: 'auto'
    });
};

// Example usage:
// const imageUrl = getCloudinaryWebUrl('calarasi-warriors/project-1', 800);
// const thumbnailUrl = getCloudinaryThumbnailUrl('calarasi-warriors/project-1', 300);
