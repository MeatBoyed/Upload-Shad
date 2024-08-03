"use client";

import Image, { ImageLoaderProps } from "next/image";
import { CardContent, CardDescription } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { DragDropContext, Draggable, DraggableProvided, Droppable, DropResult } from "@hello-pangea/dnd";
import { FileState } from "./Utils";
import { EmptyCard } from "./EmptyCard";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useContext, useMemo } from "react";
import { UploadContext, UploadContextType } from "./hooks/uploadContext";
import React from "react";

export interface UploadedFilesProps extends React.AllHTMLAttributes<HTMLDialogElement> {
  customLoader?: (props: ImageLoaderProps) => string;
}

const UploadedFiles = React.forwardRef<HTMLDialogElement, UploadedFilesProps>(
  ({ className, type, customLoader, ...props }, ref) => {
    const { uploadedImages, handleDelete, handleReOrder } = useContext(UploadContext) as UploadContextType;

    const handleDragDrop = (result: DropResult) => {
      console.log(result);

      if (!result.destination) return;

      handleReOrder(result.source.index, result.destination.index);
    };

    const images = useMemo(() => {
      if (uploadedImages && uploadedImages.length > 0) {
        return uploadedImages.map((fileState, index) => (
          <Draggable draggableId={index.toString()} key={index} index={index}>
            {(provided) => (
              <ImageCard
                customLoader={customLoader}
                provided={provided}
                fileState={fileState}
                onDelete={() => handleDelete(fileState)}
              />
            )}
          </Draggable>
        ));
      } else {
        <EmptyCard title="No files uploaded" description="Upload some files to see them here" className="w-full" />;
      }
    }, [uploadedImages]);

    return (
      <div className="flex justify-center items-start flex-col w-full gap-5 ">
        <div className="flex justify-center items-start w-full flex-col text-start">
          <h3 className="text-xl font-semibold">Uploaded files</h3>
          <CardDescription>
            {uploadedImages && uploadedImages?.length > 0
              ? `You have uploaded ${uploadedImages?.length} images.`
              : `You have no images uploaded yet.`}
          </CardDescription>
        </div>
        <CardContent className="p-0 w-full">
          {/* <div className="grid gap-3 lg:grid-cols-2 w-full" > */}
          <DragDropContext onDragEnd={handleDragDrop}>
            <Droppable droppableId="droppable-1" direction={"vertical"} type="group">
              {(provided) => (
                <div className="flex h-full gap-2 flex-wrap overflow-hidden" {...provided.droppableProps} ref={provided.innerRef}>
                  {images}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          {/* Render out Sortable Items, passing in the Card to render */}
        </CardContent>
      </div>
    );
  }
);
UploadedFiles.displayName = "UploadedFiles";

export { UploadedFiles };

// DnD kit's Sortable item to handle sort, renders out passed children (card)
interface ImageCard extends React.AllHTMLAttributes<HTMLDivElement> {
  provided: DraggableProvided;
  fileState: FileState;
  onDelete: () => void;
  customLoader?: (props: ImageLoaderProps) => string;
}
const ImageCard = React.forwardRef<HTMLDivElement, ImageCard>(
  ({ className, provided, fileState, onDelete, customLoader, ...props }, ref) => {
    return (
      <div
        className="flex flex-col items-end justify-start w-full border"
        {...provided.dragHandleProps}
        {...provided.draggableProps}
        ref={provided.innerRef}
      >
        <AspectRatio ratio={4 / 3}>
          <Image
            src={typeof fileState.file === "string" ? fileState.file : URL.createObjectURL(fileState.file)}
            alt={`image 1`}
            fill
            quality={35}
            loader={customLoader ? customLoader : undefined}
            className="rounded-md object-cover"
          />
        </AspectRatio>
        <div className="absolute flex flex-col items-center justify-center pt-1 pr-1 gap-1">
          {/* Remove Icon */}
          <div
            onClick={onDelete}
            style={{ background: "white" }}
            className="flex h-8 w-8 shadow-lg cursor-pointer items-center justify-center rounded-full border  bg-white bg-opacity-70 "
          >
            <Trash2 size={18} className="text-black " />
          </div>
        </div>
      </div>
    );
  }
);
ImageCard.displayName = "ImageCard";

export { ImageCard };
