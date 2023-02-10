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

export class Document<P> {
  public properties: P;
  static model: Model<never>;

  constructor(properties: P) {
    this.properties = properties;
  }

  get model() {
    return (this.constructor as typeof Document<P>).model;
  }

  get client() {
    return this.model.client;
  }

  get name() {
    return this.model.name;
  }

  static parse<P>(json: any): Document<P> {
    throw new Error("Not implemented");
  }

  static async find<P>(): Promise<Array<Document<P>>> {
    // Initialize transaction
    const txn = this.model.client.newTxn({ bestEffort: true, readOnly: true });
    // TODO Initialize return array
    const documents = new Array<Document<P>>();
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
      const grpc = await txn.queryWithVars(query, { $name: this.model.name });
      // Retrieve JSON response object
      const json = grpc.getJson();
      // Loop through each document
      json.documents.forEach(
        ({ uid, ...properties }: { uid?: string; properties: P }) => {
          // Create document instance
          const document = new this({ uid, ...(properties as P) });
          // Store document instance
          documents.push(document);
        }
      );
      // Return retrieved document
      return documents;
      // Retrieve
    } finally {
      // Rollback transaction, does nothing if committed
      await txn.discard();
    }
  }

  static async findOne<P>(): Promise<Document<P>> {
    throw new Error("Not implemented");
  }
}
