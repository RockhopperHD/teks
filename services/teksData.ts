import { StandardDefinition } from '../types';

/**
 * Parses a CSV string into a dictionary of StandardDefinitions.
 * Assumes format: ID, Description, Category (optional)
 * Handles quoted fields.
 */
export const parseCSV = (csvText: string): Record<string, StandardDefinition> => {
  const lines = csvText.split('\n');
  const db: Record<string, StandardDefinition> = {};
  
  for (let i = 0; i < lines.length; i++) {
     const line = lines[i].trim();
     if(!line) continue;
     
     // Regex to split by comma but ignore commas inside quotes
     const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
     
     // Fallback for simple split if regex misses (e.g. empty fields)
     const cols = matches 
        ? matches.map(col => col.replace(/^"|"$/g, '').trim()) 
        : line.split(',').map(c => c.trim());

     // Heuristic: First column is usually the ID
     if (cols.length >= 2) {
         const id = cols[0];
         
         // Skip headers
         if (id.toLowerCase() === 'id' || id.toLowerCase() === 'standard') {
            continue;
         }

         // Basic validation: ensure ID looks somewhat like a TEKS ID (often alphanumeric with dots)
         // or just take it if it's the first column.
         if (id && id.length > 2) { 
             db[id] = {
                 id,
                 description: cols[1] || "No description provided",
                 category: cols[2] || "General"
             };
         }
     }
  }
  return db;
};