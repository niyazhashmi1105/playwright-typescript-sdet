import Ajv, { ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';

export class SchemaValidator {

    private constructor() { }
    private static ajv = (() => {
        const ajvInstance = new Ajv({
            allErrors: true,
            strict: true // 🔥 allows flexibility
        });
        addFormats(ajvInstance);
        return ajvInstance;
    })();

    static validateSchema(
        schema: object,
        data: any,
        options?: {
            softValidation?: boolean;
            ignoreFields?: string[];
        }
    ): boolean {

        const validate = this.ajv.compile(schema);
        const valid = validate(data);

        if (valid) return true;

        const errors = validate.errors || [];

        const filteredErrors = this.filterErrors(errors, options?.ignoreFields);

        if (filteredErrors.length === 0) return true;

        if (options?.softValidation) {
            console.warn('⚠️ Soft validation errors:', filteredErrors);
            return true; // don't fail test
        }

        console.error('❌ Schema validation failed:', filteredErrors);
        throw new Error(JSON.stringify(filteredErrors, null, 2));
    }

    private static filterErrors(
        errors: ErrorObject[],
        ignoreFields?: string[]
    ): ErrorObject[] {

        if (!ignoreFields || ignoreFields.length === 0) return errors;

        return errors.filter(error => {
            return !ignoreFields.some(field =>
                error.instancePath.includes(field)
            );
        });
    }
}