import * as fs from 'fs';
import * as path from 'path';

export class JsonUtils {
  private constructor() {}
  static readJson(filePath: string) {
    const fullPath = path.resolve(filePath);
    const fileData = fs.readFileSync(fullPath, 'utf-8');
    return JSON.parse(fileData);
  }
}
