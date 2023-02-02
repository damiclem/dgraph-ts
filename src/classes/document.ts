import { DgraphClient, Mutation } from "dgraph-js";

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
export class Document<P> {
  public uid?: string;
  public name: string;
  public client: DgraphClient;
  public properties: P;

  // Create document
  constructor(name: string, properties: P, client: DgraphClient) {
    // Store attributes
    this.name = name;
    this.client = client;
    this.properties = properties;
  }

  // TODO Define save method
  public async save(
    options = { readonly: false, bestEffort: false }
  ): Promise<Document<P>> {
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

  // TODO Define delete method
  public async delete(
    options = { readonly: false, bestEffort: false }
  ): Promise<Document<P>> {
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

  // // TODO Define find (multiple documents) method
  // static findOne<T extends P>(doc: T) {
  //   throw Error("Not implemented!");
  // }
  // // TODO Define find (single document) method
  // static find() {
  //   throw Error("Not implemented!");
  // }
}
