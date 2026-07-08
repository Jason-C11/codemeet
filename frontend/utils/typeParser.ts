import { DBTypes } from "@/lib/types/Problem";
// ============================================================================
// 1. JSON Object/Array -> UI String for Display in CodeInterface
// ============================================================================
export function formatVariables(rawInputs: any[], params: { type: DBTypes }[]): string[] {
  return rawInputs.map((value, index) => {
    if (value === null || value === undefined) return "";
    
    const type = params[index]?.type;
    if (!type) return String(value);

    // --- 1. HANDLE 2D ARRAYS/MATRICES (e.g., "int[][]", "string[][]") ---
    if (type.endsWith("[][]")) {
      if (Array.isArray(value)) {
        const isStringType = type.startsWith("string");
        
        const formattedRows = value.map(subArray => {
          if (Array.isArray(subArray)) {
            // Inner row formatting: adds brackets around each row element list
            const rowContent = subArray
              .map(val => isStringType ? `"${val}"` : String(val))
              .join(",");
            return `[${rowContent}]`;
          }
          return String(subArray);
        });
        // Enclose the entire matrix in its outer structural brackets
        return `[${formattedRows.join(",")}]`;
      }
      return `[${value}]`;
    }

    // --- 2. HANDLE 1D ARRAYS (e.g., "int[]", "float[]", "string[]", "boolean[]") ---
    if (type.endsWith("[]")) {
      if (Array.isArray(value)) {
        const isStringType = type.startsWith("string");
        
        // Enclose the flat array list in brackets
        const arrayContent = value
          .map(val => isStringType ? `"${val}"` : String(val))
          .join(",");
          
        return `[${arrayContent}]`;
      }
      return `[${value}]`;
    }

    // --- 3. HANDLE ALL PRIMITIVES (int, float, string, boolean) ---
    if (type === "string") {
      return `"${value}"`; // Explicitly add double quotes for string primitive types
    }
    
    return String(value);
  });
}

export const formatSingleVar = (value: any, type: DBTypes) => {
  return formatVariables([value], [{ type }])[0];
};

// ============================================================================
// 2. Loose UI String -> Structured JSON for Python Backend 
// ============================================================================
export function parseParameter(input: string, type: DBTypes): any {
  const trimmed = String(input).trim();

  switch (type) {
    case "int":
      const intNum = Number(trimmed);
      if (isNaN(intNum)) throw new Error(`Invalid number: ${input}`);
      // Ensure it is parsed strictly as a whole number integer if the database specifies it
      if (!Number.isInteger(intNum)) throw new Error(`Expected an integer, but got: ${input}`);
      return intNum;

    case "float":
      const floatNum = Number(trimmed);
      if (isNaN(floatNum)) throw new Error(`Invalid decimal number: ${input}`);
      return floatNum;

    case "string":
      if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || 
          (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
        return trimmed.slice(1, -1);
      }
      return trimmed;

    case "boolean":
      if (trimmed.toLowerCase() === "true") return true;
      if (trimmed.toLowerCase() === "false") return false;
      throw new Error(`Invalid boolean: ${input}`);

    case "int[]":
    case "float[]":
    case "string[]":
    case "boolean[]":
    case "int[][]":
    case "float[][]":
    case "string[][]":
    case "boolean[][]":
      return parseArray(trimmed, type);

    default:
      throw new Error(`Unsupported type: ${type}`);
  }
}

function parseArray(trimmed: string, type: DBTypes): any[] {
  if (trimmed.startsWith("[")) {
    try { return JSON.parse(trimmed); } catch (e) { }
  }

  if (type.endsWith("[][]")) {
    const elementType = type.replace("[][]", "[]") as DBTypes;
    const rawBlocks = trimmed.split(/\]\s*,\s*\[/);
    return rawBlocks.map(block => {
      const cleanedBlock = block.replace(/[\[\]]/g, "");
      return parseArray(cleanedBlock, elementType);
    });
  }

  const cleaned = trimmed.replace(/[\[\]]/g, "");
  if (!cleaned) return [];
  const rawItems = cleaned.split(",");

  // Handle integers strictly
  if (type.startsWith("int")) {
    return rawItems.map(item => {
      const n = Number(item.trim());
      if (isNaN(n)) throw new Error(`Invalid integer in array: ${item}`);
      if (!Number.isInteger(n)) throw new Error(`Expected all elements to be integers, but found decimal: ${item}`);
      return n;
    });
  }

  // Handle decimals flexibly
  if (type.startsWith("float")) {
    return rawItems.map(item => {
      const n = Number(item.trim());
      if (isNaN(n)) throw new Error(`Invalid float in array: ${item}`);
      return n;
    });
  }

  if (type.startsWith("boolean")) {
    return rawItems.map(item => {
      const val = item.trim().toLowerCase();
      if (val === "true") return true;
      if (val === "false") return false;
      throw new Error(`Invalid boolean in array: ${item}`);
    });
  }

  return rawItems.map(item => {
    const str = item.trim();
    if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
      return str.slice(1, -1);
    }
    return str;
  });
}
