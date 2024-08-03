import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { toast } from "@/components/ui/use-toast";
import { Tag, TagInput } from "emblor";
import { uuid } from "@/lib/utils";
import { UploadShad } from "./uploadshad/main";

const FormSchema = z.object({
  images: z
    .array(typeof window === "undefined" ? z.any() : z.instanceof(File))
    .max(4, { message: `No more than ${4} Images allowed.` }),
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
          <div className="preview flex  w-full justify-center p-10 items-center mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col items-start w-full">
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start w-full">
                      <FormLabel className="text-left">Images</FormLabel>
                      <FormControl className="w-full">
                        <UploadShad
                          {...field}
                          className="w-full"
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

export function ReactHookFormDemo() {
  const initFormValues = false;
  const { control, handleSubmit, setValue } = useForm();

  function onSubmit(data: any) {
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
          <div className="preview flex w-full justify-center items-center px-10 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              <Controller
                name="images"
                control={control}
                render={({ field }) => (
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
                    className="w-full"
                  />
                )}
              />
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
