// Map properties type to actual TS type
type MapDType = {
  string: string;
  int: number;
  float: number;
  bool: boolean;
  datetime: string;
  position: string;
  password: string;
};

// Define property type (Dgraph)
type DType = keyof MapDType;

// Map Dgraph types (keys) to TS types (values)
export type MapDTypes<T extends Record<string, DType>> = {
  -readonly [K in keyof T]: MapDType[T[K]];
};

// Define property
export interface Property {
  type: DType;
  required?: boolean;
  index?: boolean;
}

// Define properties
export const String: Property = {
  type: "string",
  index: false,
  required: false,
};
export const Int: Property = { ...String, type: "int" };
export const Float: Property = { ...String, type: "float" };
export const Bool: Property = { ...String, type: "bool" };
export const DateTime: Property = { ...String, type: "datetime" };
export const Position: Property = { ...String, type: "position" };
export const Password: Property = { ...String, type: "password" };

// Define a schema mapping
export type Schema = Record<string, Property>;

function getDTypes(schema: Schema): Record<string, DType> {
  // Initialize DGraph types
  const dtypes = {} as Record<string, DType>;
  // Loop through each key-property pair
  for (const [key, property] of Object.entries(schema)) {
    // Set correct DGraph type
    dtypes[key] = property.type;
  }
  // Return DGraph types
  return dtypes;
}

function setDTypes<T extends Record<string, DType>>(t: T): T {
  // Only type gets inferred, while value does not change
  return t;
}

// // TODO Move away
// type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export function asInterface(schema: Schema) {
  // Get Dgraph type associated to each property
  const properties = getDTypes(schema);
  // Infer correct Dgraph type
  return setDTypes(properties);
}
