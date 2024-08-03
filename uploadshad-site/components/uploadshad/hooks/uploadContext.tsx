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
      const newFileStates: FileState[] = defaultImages.map((imageUrl) => ({
        key: Math.random().toString(5),
        file: imageUrl,
        progress: "COMPLETE",
      }));
      setUploadedImages(newFileStates);
      handleChange(convertUploadedImages(newFileStates));
    }
  }, []);

  const handleUpload = async (files: File[]) => {
    // Add and convert File to FileState
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

  const handleDelete = (deletedFile: FileState) => {
    console.log("Deleting file: ", deletedFile);
    // Remove deleted file from state
    const images: FileState[] = uploadedImages?.filter((image) => image.key != deletedFile.key) || [];

    // Ensure Image is already uploaded & Behave assuming Property is already created
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

    // Ensure
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
    const fileStateIds = uploadedImages?.map((file) => file.key) || [];
    // const oldIndex = fileStateIds.indexOf(destination);
    // const newIndex = fileStateIds.indexOf(source);

    const newImages = reorder(uploadedImages || [], source, destination);
    // const newImages = arrayMove(uploadedImages || [], oldIndex, newIndex);

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
