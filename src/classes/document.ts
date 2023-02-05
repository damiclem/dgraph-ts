import { DgraphClient, Mutation, Operation } from "dgraph-js";
import { Model } from "./model";
import { MapDTypes, Schema } from "./schema";

// Define function for returning UID out of response
function getUID(response: any): string {
  // Initialize first UID
  let first: string;
  // Loop through each UID
  response.getUidsMap().forEach((uid: string, key: string) => (first = uid));
  // Return first UID
  return first;
}

// // TODO Use a workaround in order to use class type in static function
// // https://stackoverflow.com/questions/52518125/workaround-for-accessing-class-type-arguments-in-static-method-in-typescript
export class Document<P, S extends Schema> {
  public properties: P & { uid?: string };
  public model: Model<S>;

  // Create document
  constructor(properties: P & { uid?: string }, model: Model<S>) {
    // Store attributes
    this.properties = properties;
    this.model = model;
  }

  /**
   * Get client out of model
   */
  get client() {
    return this.model.client;
  }

  /**
   * Get document name out of model
   */
  get name() {
    return this.model.name;
  }

  /**
   * Get unique identifier for document, if any
   */
  get uid() {
    return this.properties.uid;
  }

  /**
   * TODO Get multiple documents
   */
  static find() {
    throw new Error("Not implemented");
  }

  /**
   * TODO Get single document
   */
  static findOne() {
    throw new Error("Not implemented");
  }

  /**
   * TODO Save current document
   */
  public save(): Promise<Document<P, S>> {
    throw new Error("Not implemented");
  }

  /**
   * TODO Delete current document
   */
  public delete(): Promise<Document<P, S>> {
    throw new Error("Not implemented");
  }
}

/**
 * TODO Cast JSON object to given document
 *
 */
export function fromJson<P, S extends Schema>(
  json: any,
  properties: P,
  model: Model<S>
): Document<P, S> {
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
  return new Document<P, S>({ ...(properties_ as P), uid }, model);
}

/**
 * Find multiple documents in database corresponding to given model
 *
 * @param model
 */
export async function find<S extends Schema>(model: Model<S>) {
  // Get DGraph client
  const client = model.client;
  // Initialize transaction
  const txn = client.newTxn({ bestEffort: true, readOnly: true });
  // get properties from model
  const properties = model.properties;
  // Define type for properties
  type Properties = MapDTypes<typeof properties>;
  // Initialize results array
  const documents = new Array<Document<Properties, S>>();
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
  // TODO Loop through each document
  json.documents.forEach((item: never) => {
    // Store document
    documents.push(
      fromJson(item, properties, model) as Document<Properties, S>
    );
  });
  // Return retrieved document
  return documents;
}

export async function findOne<S extends Schema>(uid: string, model: Model<S>) {
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
  const grpc = await txn.queryWithVars(query, { $uid: uid, $name: model.name });
  // Retrieve JSON response object
  const json = grpc.getJson().shift();
  // Loop through each property key
  return new Document(fromJson(json, properties, model), model);
}
