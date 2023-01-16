import {Schema} from "./schema";

export class Model {
    private name: string;
    private schema: Schema;
    constructor(name: string, schema: Schema) {
        this.name = name;
        this.schema = schema;
    }
}