[UploadShad](https://uploadshad.nerfdesigns.com/) is a highly customizable, accessible, and fully-featured File input component built with Shadcn UI.

## About

UploadShad is a highly customizable, accessible, and un-opinionated Image Uploader component built for ShadCN Forms and React applications. It provides seamless integration, appropriate form error handling, and un-opinionated method of final uploading of files to storage solution.

## Installation

To install UploadShad, follow the short guide on [installing UploadShad](https://uploadshad.nerfdesigns.com/installation).

## Features

- **Validation**: Validate Images based on File size, and number of files expected.
- **MaxFiles**: Set a maximum number of Files.
- **Sorting**: Sort tags alphabetically.
- **NewFiles and Order**: Access newly uploaded (local) fiels and the order of pre-uploaded (on a server) & New Files.
- **Popovers**: Use popovers to display form state updates (Success or error).
- **Accessibility**: Ensure that the File input is accessible to all users.
- **DropZone**: Allow users to upload files using a Drop Zone.
- **Drag and Drop**: Allow users to sort file order using drag and drop.

## Usage

Here's a sample implementation that initializes the component.

The example below uses `tailwindcss` `@shadcn/ui` `tailwind-merge` `clsx`:

```tsx
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { toast } from "@/components/ui/use-toast";

const FormSchema = z.object({
  images: z
    .array(typeof window === "undefined" ? z.any() : z.instanceof(File))
    .max(4, { message: "No more than 4 Images allowed." }),
  imagesOrder: z.string().array().optional(),
  deletedImages: z.string().array().optional(),
});

export function ShadcnFormDemo() {
  const initFormValues = false;
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      images: [],
    },
  });

  const { setValue } = form;

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <section className="z-10 w-full flex flex-col items-center text-center gap-5">
      <div id="try" className="w-full py-8">
        <div className="w-full relative my-4 flex flex-col space-y-2">
          <div
            className="preview flex  w-full justify-center p-10 items-center mt-2 ring-offset-background
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md"
          >
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 flex flex-col
                      items-start w-full"
              >
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start w-full">
                      <FormLabel className="text-left">Images</FormLabel>
                      <FormControl className="w-full">
                        <UploadShad
                          {...field}
                          maxFiles={5}
                          maxSize={5 * 1024 * 1024}
                          defaultValues={field.value}
                          handleChange={(uploadedImages, deletedImages) => {
                            // Only Set Deleted images & Images Order State if form is Pre-Populated
                            if (!initFormValues) {
                              if (deletedImages) setValue("deletedImages", deletedImages);
                              setValue("imagesOrder", uploadedImages.order);
                            }
                            setValue("images", uploadedImages.newImages);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
```

## API Reference

### TagInput

The primary component for user interaction. Configure the tag input behavior and appearance using these props, and manage tag data dynamically.

#### Props

```typescript
type TagInputProps = {
  defaultValues?: string[]; // Array of default images for the input
  maxFiles?: number; // The maximum number of files that can be uploaded.
  maxSize: number; // The maximum size of the files that can be uploaded, in bytes.
  handleChange: (uploadedImages: { newImages: File[]; order: string[] }, deletedImages?: string[], newImages?: File[]) => void;
  // A function that is called when the files are changed.
  customLoader?: () => string; // An optional function that returns a string to be used as a custom loader.
};
```

## Implementations

You can learn more about [implementing UploadShad with Shadcn Form](https://uploadshad.nerfdesigns.com/integrations/shadcn-form)
You can learn more about [implementing UploadShad with React-hook-form](https://uploadshad.nerfdesigns.com/integrations/react-hook-form)

## Documentation

You can find out more about the API and implementation in the [Documentation](https://uploadshad.nerfdesigns.com/).
