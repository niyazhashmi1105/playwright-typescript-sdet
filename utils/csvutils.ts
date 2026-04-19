import * as fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export class CSVUtils {
  private constructor() {}
  static readCSv(filePath: string): any[] {
    const fullPath = path.resolve(filePath);
    const fileContents = fs.readFileSync(fullPath, 'utf-8');
    const records = parse(fileContents, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    return records;
  }
}
