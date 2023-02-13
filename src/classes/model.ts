import { Schema, MapDTypes, Property } from "./schema";
import { Connection } from "./connection";
import { Document } from "./document";
import { Operation } from "dgraph-js";

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

  // Define getter for properties
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

  // Define getter for document constructor
  get document() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const model = this;
    // Retrieve properties
    const properties = model.properties;
    // Define type of properties
    type Properties = MapDTypes<typeof properties>;
    // TODO Define document constructor
    return class extends Document<Properties, S> {
      constructor(properties: Properties) {
        // Store properties, model
        super(properties, model);
      }

      static parse(json: any): Document<Properties, S> {
        // Define unique identifier
        const uid: string = json["uid"];
        // Initialize properties
        const properties_ = Object.fromEntries(
          Object.keys(properties).map((key) => {
            // Compose custom key
            const _key = model.name + "_" + key;
            // Return expected key, value pair
            return [key, json[_key]];
          })
        );
        // Create document
        return new this({ uid, ...(properties_ as Properties) });
      }

      static async find() {
        // Initialize transaction
        const txn = model.client.newTxn({ bestEffort: true, readOnly: true });
        // Initialize return array
        const documents = new Array<Document<Properties, S>>();
        // Define transaction
        try {
          // Define query
          // NOTE Predicate expand(_all_) requires type to be set
          const query = `query documents($name: string) {
            documents(func: eq(dgraph.type, $name)) {
              expand(_all_)
            }
          }`;
          // Retrieve gRPC response object
          const grpc = await txn.queryWithVars(query, { $name: model.name });
          // Retrieve JSON response object
          const json = grpc.getJson();
          // Parse each document
          json.documents.forEach((item: any) =>
            // Parse and store document
            documents.push(this.parse(json))
          );
          // Return retrieved document
          return documents;
          // Retrieve
        } finally {
          // Rollback transaction, does nothing if committed
          await txn.discard();
        }
      }

      static async findOne(uid: string) {
        // Get DGraph client
        const client = model.client;
        // Initialize transaction
        const txn = client.newTxn({ bestEffort: true, readOnly: true });
        // Get properties (keys are needed)
        const properties = model.properties;
        // Set type for properties
        type Properties = MapDTypes<typeof properties>;
        // Define query
        // NOTE Predicate expand(_all_) requires type to be set
        const query = `query documents($uid: string, $name: string) {
          documents(func: eq(uid, $uid)) @filter(eq(dgraph.type, $name)) {
            expand(_all_)
          }
        }`;
        // Retrieve gRPC response object
        const grpc = await txn.queryWithVars(query, {
          $uid: uid,
          $name: model.name,
        });
        // Retrieve JSON response object
        const json = grpc.getJson().shift();
        // Loop through each property key
        return this.parse(json);
      }

      static async setTypeAndIndices(indices = false): Promise<void> {
        // Initialize indices and type for DGraph schema
        let [_indices, _types] = [``, ``];
        // Initialize name for DGraph schema
        const _name = this.name;
        // Loop through each parameter in schema
        for (const key of Object.keys(model.schema)) {
          // Set custom key
          const _key = _name.toLowerCase() + "_" + key;
          // TODO Update DGraph type
          _types += `  ${_key}\n`;
        }
        // TODO Case indices flag is set
        if (indices === true) {
          // Loop through each parameter in schema
          for (const [key, property] of Object.entries(model.schema)) {
            const _key = _name.toLowerCase() + "_" + key;
            const _type = property.type;

            let _index = ``;
            // Set index
            if (property.index === true) {
              // Check property type
              if (property.type === "string") {
                // TODO Set index according to chosen one
                _index = `hash`;
              } else if (property.type === "datetime") {
                // TODO Set datetime index
                _index = ``;
              } else {
                // Set default index
                _index = property.type;
              }
              // Wrap index
              _index = _index ? `index(${_index})` : ``;
            }
            // TODO Set index
            _indices += `${_key}: ${_type} ${_index} .\n`;
          }
        }
        // Define (alter schema) operation
        const op = new Operation();
        op.setSchema(`
          type ${_name} {
            ${_types}
          }
                
          car_model: string @index(hash) .
          car_brand: string @index(hash) .
        `);
        // Set schema
        op.setRunInBackground(false); // TODO Set indices computation strategy
        // Run (alter schema) operation
        await model.client.alter(op);
      }

      public async getTypeAndIndices(): Promise<any> {
        throw new Error("NotImplemented");
      }
    };
  }
}
