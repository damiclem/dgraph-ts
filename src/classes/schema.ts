// Map properties type to actual TS type
export type DTypesMap = {
  string: string;
  int: number;
  float: number;
  bool: boolean;
  datetime: string;
  position: string;
  password: string;
};

// Define property type (Dgraph)
export type DType = keyof DTypesMap;

// Map Dgraph types (keys) to TS types (values)
export type MapDTypes<T extends Record<string, keyof DTypesMap>> = {
  -readonly [K in keyof T]: DTypesMap[T[K]];
};

// Define property
export type Property = {
  type: DType;
  default?: undefined;
  required?: boolean;
  index?: boolean;
};

// Define properties
export const String = {
  type: "string",
  index: false,
  required: false,
} as const;
export const Integer = { ...String, type: "int" } as const;
export const Float = { ...String, type: "float" } as const;
export const Boolean = { ...String, type: "bool" } as const;
export const DateTime = { ...String, type: "datetime" } as const;
export const Position = { ...String, type: "position" } as const;
export const Password = { ...String, type: "password" } as const;

export type Schema = Record<string, Property>;

export function asSchema<T extends Record<string, Property>>(t: T): T {
  return t;
}
