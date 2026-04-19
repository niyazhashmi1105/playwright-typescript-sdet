import * as fs from 'fs';
import * as path from 'path';

export class JsonUtils {
  private constructor() {}
  static readJson<T>(filePath: string): T {
    const fullPath = path.resolve(filePath);
    const fileData = fs.readFileSync(fullPath, 'utf-8');
    return JSON.parse(fileData);
  }
}
