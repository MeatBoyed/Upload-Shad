import { promises as fs } from "fs"; // Import the file system module for asynchronous file operations
import path from "path"; // Import the path module for working with file paths
import { z } from "zod"; // Import the Zod library for data validation
import { registryEntrySchema, registryItemFileSchema, registrySchema } from "@/registry/schema"; // Import the schema for validating registry item files

const REGISTRY_BASE_PATH = "registry"; // Define the base path for the registry folder
const PUBLIC_FOLDER_BASE_PATH = "public/registry"; // Define the base path for the public registry folder

/**
 * Cleans the registry by iterating through all JSON files in a given folder and validating them against the registry item file schema.
 * If a file is valid, it is re-written with proper indentation. If a file is invalid, an error message is logged.
 * @param folderPath The path to the folder containing the registry files.
 */
async function cleanRegistry(folderPath: string) {
  const files = await fs.readdir(folderPath); // Read all files in the given folder
  for (const file of files) {
    // Iterate through each file
    if (path.extname(file) === ".json") {
      // Check if the file is a JSON file
      const filePath = path.join(folderPath, file); // Construct the full file path
      const fileContent = await fs.readFile(filePath, "utf-8"); // Read the file content as a string
      const parsedFile = registryEntrySchema.safeParse(JSON.parse(fileContent)); // Parse the file content and validate it against the schema
      if (parsedFile.success) {
        // If the file is valid
        const files = parsedFile.data.files;

        if (parsedFile.data.name === "uploadshad-api") {
          files?.map((file) => {
            if (typeof file !== "string") {
              file.target = file.target?.replace("components/component/", "app/api/");
            }
          });
        }

        files?.map((file) => {
          if (typeof file !== "string") {
            file.target = file.target?.replace("components/component/", "components/");
          }
        });

        const newFileContent = JSON.stringify(parsedFile.data, null, 2); // Re-stringify the data with proper indentation
        await fs.writeFile(filePath, newFileContent, "utf-8"); // Write the new file content to the file
        console.log(`File ${file} cleaned and saved.`); // Log a success message
      } else {
        // If the file is invalid
        console.error(`Error parsing file ${file}:`, parsedFile.error); // Log an error message
      }
    }
  }
}

cleanRegistry(PUBLIC_FOLDER_BASE_PATH);
