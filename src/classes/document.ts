// Define function for returning UID out of response
import { Schema } from "./schema";
import { Mutation } from "dgraph-js";
import { Model } from "./model";

export function getUID(response: any): string {
  // Initialize first UID
  let first: string;
  // Loop through each UID
  response.getUidsMap().forEach((uid: string, key: string) => (first = uid));
  // Return first UID
  return first;
}

export class Document<P, S extends Schema> {
  public uid?: string;
  public properties: P;
  public model: Model<S>;

  constructor(properties: P & { uid?: string }, model: Model<S>) {
    // Separate UID and properties
    const { uid, ...others } = properties;
    // Store UID and properties
    this.properties = others as P;
    this.uid = uid as string;
    // Store model
    this.model = model;
  }

  get name() {
    return this.model.name;
  }

  get client() {
    return this.model.client;
  }

  public async save(options = { readonly: true, bestEffort: false }) {
    // Initialize transaction
    const txn = this.client.newTxn(options);
    // Define transaction
    try {
      // Initialize mutation
      const mu = new Mutation();
      // Set properties as
      mu.setSetJson(this.properties);
      // Execute mutation
      const response = await txn.mutate(mu);
      // Commit transaction
      await txn.commit();
      // Get UID of inserted document (node)
      this.uid = getUID(response);
    } finally {
      // Rollback transaction, does nothing if committed
      await txn.discard();
    }
    // Return current document
    return this;
  }

  public async remove(options = { readonly: false, bestEffort: false }) {
    // Case UID is set
    if (this.uid) {
      // Initialize transaction
      const txn = this.client.newTxn(options);
      // Define transaction
      try {
        // Initialize mutation
        const mu = new Mutation();
        // Set properties as
        mu.setDeleteJson({ uid: this.uid });
        // Execute mutation
        const response = await txn.mutate(mu);
        // Commit transaction
        await txn.commit();
        // Get UID of inserted document (node)
        this.uid = getUID(response);
      } finally {
        // Rollback transaction, does nothing if committed
        await txn.discard();
      }
      // Unset UID
      this.uid = undefined;
      // Return current instance
      return this;
    }
    // Otherwise, throw error
    throw Error("UID is not set!");
  }
}
