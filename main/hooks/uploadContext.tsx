"use client";

import React, { useState, useEffect, createContext } from "react";
import { convertDeletedImages, convertUploadedImages, FileState } from "../Utils";

const AWS_S3_BASE_URL = process.env.NEXT_PUBLIC_AWS_S3_BASE_URL;

if (!AWS_S3_BASE_URL) {
  throw new Error("AWS Base Url could not be found in .env file. Therefore Upload Context is unable to generate S3 Bucket urls");
}

// Enabling TS features
export type UploadContextType = {
  uploadedImages?: FileState[];
  delImages: FileState[];
  handleDelete: (deletedFile: FileState) => void;
  handleUpload: (files: File[]) => Promise<void>;
  handleReOrder: (source: number, destination: number) => void;
};

export const UploadContext = createContext<UploadContextType | null>(null);

export const UploadContextProvider: React.FC<{
  handleChange: (uploadedImages: { newImages: File[]; order: string[] }, deletedImages?: string[], newImages?: File[]) => void;
  defaultImages?: string[];
  children: React.ReactNode;
}> = ({ children, defaultImages, handleChange }) => {
  const [uploadedImages, setUploadedImages] = useState<FileState[]>();
  const [deletedImages, setDeletedImages] = useState<FileState[]>([]);

  //   Init default values
  useEffect(() => {
    if (defaultImages) {
      // Create FileStates from provided defaultImages
      const newFileStates: FileState[] = defaultImages.map((imageUrl) => ({
        key: Math.random().toString(5),
        file: imageUrl,
        progress: "COMPLETE",
      }));

      // store in state & call handler
      setUploadedImages(newFileStates);
      handleChange(convertUploadedImages(newFileStates));
    }
  }, []);

  /**
   * Upload Files and stores it to State
   */
  const handleUpload = async (files: File[]) => {
    // Convert File to FileState
    const newFileStates: FileState[] = files.map((image) => ({
      file: image,
      progress: "PENDING", // Set to PENDING, as it hasn't been Uploaded to S3
      key: Math.random().toString(5),
    }));

    setUploadedImages((prev) => [...(prev || []), ...newFileStates]); // Update Files state
    handleChange(
      convertUploadedImages([...(uploadedImages || []), ...newFileStates]) // Update Property Form
    );
  };

  /**
   * Deletes File and updates state
   * @param deletedFile - FileState
   */
  const handleDelete = (deletedFile: FileState) => {
    // Remove deleted file from state
    const images: FileState[] = uploadedImages?.filter((image) => image.key != deletedFile.key) || [];

    // Ensure if Image is already uploaded & Behave assuming Form Object is already created
    if (
      deletedFile.progress === "COMPLETE" &&
      typeof deletedFile.file === "string" &&
      deletedFile.file.startsWith(AWS_S3_BASE_URL)
    ) {
      setDeletedImages((prev) => [...prev, deletedFile]); // Set Image State

      setUploadedImages(images); // Set Image State

      // Update Images field (new Images), images Order field, and deleted Images field in form
      handleChange(convertUploadedImages(images), convertDeletedImages([...deletedImages, deletedFile])); // Enforces AWS S3 deletion is necessary
    }

    // Ensure if Image is not uploaded, then simply update state
    if (deletedFile.progress === "PENDING" && deletedFile.file instanceof File) {
      setUploadedImages(images); // Set Image State;
      handleChange(convertUploadedImages(images)); // Enforces AWS S3 uploading is necessary
    }
  };

  const reorder = (list: FileState[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed || "");

    return result;
  };

  // Check for a change in items order
  const handleDragEnd = function handleDragEnd(source: number, destination: number) {
    // Get new Images order
    const newImages = reorder(uploadedImages || [], source, destination);

    // Update state
    setUploadedImages(newImages);
    handleChange(convertUploadedImages(newImages));
  };

  return (
    <UploadContext.Provider
      value={{
        uploadedImages: uploadedImages,
        delImages: deletedImages,
        handleDelete: handleDelete,
        handleUpload: handleUpload,
        handleReOrder: handleDragEnd,
      }}
    >
      {children}
    </UploadContext.Provider>
  );
};
