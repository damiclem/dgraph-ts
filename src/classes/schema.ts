// Define a schema mapping
export type Schema = Record<string, Property>;

// Define property type
export type Type = 'int' | 'float' | 'string' | 'bool' | 'datetime' | 'position' | 'password';

// Define property
export interface Property {
    type: Type,
    required?: boolean,
    index?: boolean,
}

// Define properties
export const String: Property = { type: 'string', index: false, required: false };
export const Int: Property = { ...String, type: 'int' };
export const Float: Property = { ...String, type: 'float' };
export const Bool: Property = { ...String, type: 'bool' };
export const DateTime: Property = { ...String, type: 'datetime' };
export const Position: Property  = { ...String, type: 'position' };
export const Password: Property = { ...String, type: 'password' };