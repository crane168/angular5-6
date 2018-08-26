import { JSONSchema } from './json-schema';
/**
 * @todo Add other JSON Schema validation features
 */
export declare class JSONValidator {
    protected readonly simpleTypes: string[];
    protected isObjectNotNull(value: any): boolean;
    /**
     * Validate a JSON data against a JSON Schema
     * @param data JSON data to validate
     * @param schema Subset of JSON Schema
     * @returns If data is valid : true, if it is invalid : false, and throws if the schema is invalid
     */
    validate(data: any, schema: JSONSchema): boolean;
    protected validateProperties(data: {}, schema: JSONSchema): boolean;
    protected validateRequired(data: {}, schema: JSONSchema): boolean;
    protected validateType(data: any, schema: JSONSchema): boolean;
    protected validateTypeList(data: any, schema: JSONSchema): boolean;
    protected validateItems(data: any[], schema: JSONSchema): boolean;
    protected validateItemsList(data: any, schema: JSONSchema): boolean;
}
