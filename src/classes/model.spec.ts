import { String, Integer } from "./schema";
import { Model } from "./model";

test("test model definition", () => {
  // Define model
  const model = new Model("User", {
    name: { type: "string", required: true },
    age: Integer,
    email: String,
  });
  // Get document constructor
  const User = model.document;
  // Create user
  const user = new User({ name: "", age: 1, email: "user.email@host.domain" });
  // TODO Remove this
  expect(typeof user.properties.name).toEqual("string");
  expect(typeof user.properties.age).toEqual("number");
  expect(typeof user.properties.email).toEqual("string");
});
