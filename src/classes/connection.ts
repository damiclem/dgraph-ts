import { Schema } from "./schema";
import { Model } from "./model";
import { DgraphClientStub, DgraphClient } from "dgraph-js";
import * as grpc from "@grpc/grpc-js";
import { ChannelCredentials } from "@grpc/grpc-js";

export interface ClientConfig {
  uri: string;
  credentials?: ChannelCredentials;
}

export class Connection {
  stubs: DgraphClientStub[];
  client: DgraphClient;

  constructor(clients: ClientConfig[], debug?: boolean) {
    // Instantiate client stubs
    this.stubs = clients.map(
      ({ uri, credentials }) =>
        new DgraphClientStub(
          uri,
          credentials || grpc.credentials.createInsecure()
        )
    );
    // Instantiate client
    // TODO Handle multiple stubs
    this.client = new DgraphClient(...this.stubs);
    this.client.setDebugMode(debug === true);
  }

  model(name: string, schema: Schema) {
    // TODO Set connection
    return new Model(name, schema);
  }
}
