import { String, Integer } from "./schema";
import { Model } from "./model";

// // Define properties getter
// function getProperties<S extends Schema>(schema: S) {
//   // Extract properties
//   const _props = Object.entries(schema).map(([key, prop]) => [key, prop.type]);
//   // Create properties dictionary
//   const props = Object.fromEntries(_props);
//   // Return properties dictionary
//   return props as { [K in keyof S]: S[K]["type"] };
// }

// // TODO Define getter for document constructor
// function getDocumentConstructor<T extends Schema>(model: Model<T>) {
//   // // Get client from model
//   // const client = model.client;
//   // // Define type of client
//   // type Client = typeof client;
//   // Retrieve properties
//   const properties = model.properties;
//   // Define type of properties
//   type Properties = MapDTypes<typeof properties>;
//   // Return constructor
//   return class {
//     // public client?: Client;
//     public properties: Properties;
//     constructor(properties: Properties) {
//       // // Initialize attributes
//       // this.client = client;
//       this.properties = properties;
//     }
//   };
// }

test("test schema definition", () => {
  // Initialize schema
  const schema = {
    name: { type: "string", required: false },
    age: { type: "int", required: false },
  } as const;
  // Check schema type
  // NOTE At runtime, const assertion is erased!
  expect(typeof schema.name.type === "string").toBeTruthy();
  expect(typeof schema.age.type !== "string").toBeFalsy();
});

test("test model definition", () => {
  // Define model
  const model = new Model("User", {
    name: { type: "string", required: true },
    age: Integer,
    email: String,
  });
  // Get document constructor
  const User = model.document;
  // Create user
  const user = new User({ name: "", age: 1, email: "user.email@host.domain" });
  // TODO Remove this
  expect(typeof user.properties.name).toEqual("string");
  expect(typeof user.properties.age).toEqual("number");
  expect(typeof user.properties.email).toEqual("string");
});
