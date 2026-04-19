import path from 'path';
import XLSX from 'xlsx';

export class ExcelUtils {
  private constructor() {}
  static readExcel(filePath: string, sheetName: string): any[] {
    const fullPath = path.resolve(filePath);
    const workbook = XLSX.readFile(fullPath);
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" not found`);
    }
    const data = XLSX.utils.sheet_to_json(sheet, { defval: '' });
    return data;
  }
}
