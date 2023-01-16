import {Schema} from "./schema";
import {Model} from "./model";

export class Connection {

    uri: string;

    constructor(uri: string) {
        // Store attributes
        this.uri = uri;
    }

    public model(name: string, schema: Schema) {
        // TODO Set connection
        return new Model(name, schema)
    }
}