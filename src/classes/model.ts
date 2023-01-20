import { Schema, MapDTypes } from "./schema";
import { Connection } from "./connection";
import { Document } from "./document";

export class Model<S extends Schema> {
  public name: string;
  public schema: S;
  public connection?: Connection;

  constructor(name: string, schema: S, connection?: Connection) {
    // Initialize name and schema
    this.name = name;
    this.schema = schema;
    this.connection = connection;
  }

  // Define client getter
  get client() {
    return this.connection!.client;
  }

  // TODO Define getter for properties
  get properties() {
    // Define schema
    const schema = this.schema;
    // Extract properties
    const _props = Object.entries(schema).map(([key, prop]) => [
      key,
      prop.type,
    ]);
    // Create properties dictionary
    const props = Object.fromEntries(_props);
    // Return properties dictionary
    return props as { [K in keyof S]: S[K]["type"] };
  }

  // TODO Define getter for document constructor
  get document() {
    //  Retrieve name
    const name = this.name;
    //  Retrieve client
    const client = this.client;
    // Retrieve properties
    const properties = this.properties;
    // Define type of properties
    type Properties = MapDTypes<typeof properties>;
    // Return constructor
    return class extends Document<Properties> {
      constructor(properties: Properties) {
        // TODO Call parent constructor
        super(name, properties, client);
      }
    };
  }
}
