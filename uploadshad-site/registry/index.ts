import { NDXRegistry } from "./ndx-registry";
import { uploadShadAccessories, uploadshadRegistry } from "./uploadshad-registry";

export const registryComponents = [...uploadShadAccessories, ...uploadshadRegistry, ...NDXRegistry];
