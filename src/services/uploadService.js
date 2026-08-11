import cloudinary from "../config/cloudinary.js";

/**
 * Upload a file to Cloudinary.
 *
 * @param {string} filePath - Local path to the file
 * @param {string} folder - Cloudinary folder name
 * @param {string} resourceType - Cloudinary resource type
 * @returns {Object} Cloudinary upload result
 */
export const uploadFile = async (
  filePath,
  folder,
  resourceType = "auto"
) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: resourceType,
  });

  return {
    url: result.secure_url,
    public_id: result.public_id,
    resource_type: result.resource_type,
    format: result.format,
  };
};

export const deleteFile = async (
  publicId,
  resourceType = "image"
) => {
  return await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
};
