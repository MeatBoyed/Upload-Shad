"use client";

import Image from "next/image";
import { CardContent, CardDescription } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LegacyRef, ReactNode, useContext, useMemo, useRef } from "react";
import { UploadContext, UploadContextType } from "./hooks/uploadContext";
import { FileState } from "./Utils";
import { EmptyCard } from "./EmptyCard";

export function UploadedFilesCard() {
  // Sensors for DnD
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { uploadedImages, handleDelete, handleReOrder } = useContext(
    UploadContext
  ) as UploadContextType;

  const images = useMemo(
    () =>
      uploadedImages && uploadedImages.length > 0 ? (
        uploadedImages.map((fileState, index) => (
          <SortableItem
            key={fileState.key}
            id={fileState.key}
            fileState={fileState}
          >
            <div
              className="absolute top-2 right-2 hover:cursor-pointer bg-white rounded-full p-2 flex justify-center items-center text-black hover:bg-white hover:text-red-500 "
              onClick={() => handleDelete(fileState)} // Takes 2,3,4 clicks to actually delete
            >
              <Trash2 size={20} />
            </div>
          </SortableItem>
        ))
      ) : (
        <EmptyCard
          title="No files uploaded"
          description="Upload some files to see them here"
          className="w-full"
        />
      ),
    [uploadedImages]
  );

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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleReOrder}
        >
          <SortableContext
            items={uploadedImages?.map((file) => file.key) || []} // Supply the a String unique value (or exact value) to Identify elements
            strategy={verticalListSortingStrategy}
          >
            <div
              className="grid gap-3 lg:grid-cols-2 w-full"
              onClick={() => console.log("Pleasee")}
            >
              {images}
              {/* Render out Sortable Items, passing in the Card to render */}
            </div>
          </SortableContext>
        </DndContext>
      </CardContent>
    </div>
  );
}

// DnD kit's Sortable item to handle sort, renders out passed children (card)
export function SortableItem({
  id,
  fileState,
  children,
}: {
  id: UniqueIdentifier;
  fileState: FileState;
  children: ReactNode;
}) {
  const { attributes, listeners, node, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => console.log("Heelo fro top")}
      {...attributes}
      {...listeners}
    >
      <div className="relative aspect-video w-full border">
        <Image
          src={
            typeof fileState.file === "string"
              ? fileState.file
              : URL.createObjectURL(fileState.file)
          }
          alt={`image 1`}
          fill
          className="rounded-md object-cover"
        />
        <div className="absolute top-0 right-0 w-full h-full rounded-md delBtn">
          <div className="bg-black opacity-40 w-full h-full" />
          {children}
        </div>
      </div>
    </div>
  );
}
