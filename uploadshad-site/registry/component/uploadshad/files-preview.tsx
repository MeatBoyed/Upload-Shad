import { CardContent } from "@/components/ui/card";
import { PropsWithChildren, useMemo } from "react";
import { EmptyCard } from "@/registry/component/uploadshad/emptycard";
import Image, { ImageLoaderProps } from "next/image";
import { Trash2 } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useFilesContext } from "./hooks";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { toast } from "sonner";

type FilesPreviewProps = PropsWithChildren & {
  customLoader?: (props: ImageLoaderProps) => string;
};

export default function FilesPreview({ children, customLoader }: FilesPreviewProps) {
  const { files, handleDelete, handleReOrder } = useFilesContext();

  const handleDragDrop = (result: DropResult) => {
    if (!result.destination) return;
    handleReOrder(result.source.index, result.destination.index);
  };

  const renderFiles = useMemo(() => {
    // console.log("UploadShad Tracking: Preview View - Rendering files: ", files);
    if (files.length > 0) {
      return files.map((file: string, index) => (
        <Draggable draggableId={index.toString()} key={index} index={index}>
          {(provided) => (
            <FilesPreviewPreviewCard
              key={index}
              fileUrl={file}
              provided={provided}
              customLoader={customLoader}
              onDelete={() => {
                toast.promise(handleDelete(file), {
                  loading: "Deleting File...",
                  success: () => {
                    return `File deleted successfully`;
                  },
                  error: `Oops, something happened. Please try again.`,
                });
              }}
            />
          )}
        </Draggable>
      ));
    } else {
      return (
        <EmptyCard
          title="No files uploaded"
          description="Upload some files to see them here"
          className="w-full"
        />
      );
    }
  }, [files, handleDelete, customLoader]);

  return (
    <div className="flex justify-center items-start flex-col w-full gap-5 ">
      {/* Head */}
      {children}
      <CardContent className="p-0 w-full">
        <div className="w-full">
          {/* <div className="flex h-full gap-2 flex-wrap overflow-hidden">{renderFiles}</div> */}
          {/* Render out Sortable Items, passing in the Card to render */}
          <DragDropContext onDragEnd={handleDragDrop}>
            <Droppable droppableId="droppable-1" direction={"vertical"} type="group">
              {(provided) => (
                <div
                  className="grid gap-3  w-full"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {renderFiles}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </CardContent>
    </div>
  );
}

FilesPreview.Head = function FilesPreviewHead({ children }: PropsWithChildren) {
  return (
    <div className="flex justify-center items-start w-full flex-col text-start">{children}</div>
  );
};

function FilesPreviewPreviewCard({
  fileUrl,
  onDelete,
  children,
  provided,
  customLoader,
}: PropsWithChildren & {
  fileUrl: string;
  onDelete: () => void;
  provided: DraggableProvided;
  customLoader?: (props: ImageLoaderProps) => string;
}) {
  return (
    <div
      className="flex flex-col items-end justify-start w-full border"
      {...provided.dragHandleProps}
      {...provided.draggableProps}
      ref={provided.innerRef}
    >
      <AspectRatio ratio={4 / 3}>
        <Image
          src={fileUrl}
          alt={`image 1`}
          fill
          quality={35}
          loader={customLoader}
          className="rounded-md object-cover"
        />
      </AspectRatio>
      <div className="absolute flex flex-col items-center justify-center pt-1 pr-1 gap-1">
        <div
          onClick={onDelete}
          style={{ background: "white" }}
          className="flex h-8 w-8 shadow-lg cursor-pointer items-center justify-center rounded-full border hover:text-red-500 bg-white bg-opacity-70 "
        >
          <Trash2 size={18} className=" text-black hover:text-red-500" />
        </div>
      </div>
    </div>
  );
}
