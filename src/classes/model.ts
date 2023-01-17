import { Schema, asInterface, MapDTypes } from "./schema";
import { Connection } from "./connection";
//
// export class Document<Schema> {
//   conn?: Connection;
//   props: as;
//   constructor(props: Record<string, any>) {}
// }

export class Model {
  public name: string;
  public schema: Schema;
  public connection?: Connection;

  constructor(name: string, schema: Schema) {
    this.name = name;
    this.schema = schema;
  }

  // Define client getter
  get client() {
    return this.connection!.client;
  }

  // TODO Generate document constructor out of model
  get document() {
    // Cast schema to interface
    const _schema = asInterface(this.schema);
    // Define properties for current document out of model's schema
    type Properties = MapDTypes<typeof _schema>;
    // Define connection
    const connection = this.connection;
    // Create document constructor
    return class {
      properties: Properties;
      connection?: Connection;

      // TODO Define properties types
      constructor(properties: Properties) {
        // Store properties passed as input
        this.properties = properties;
        // Set connection
        this.connection = connection;
      }

      get client() {
        // Return client, if any
        return this.connection?.client;
      }
    };
  }
}
