import { Schema, String } from "./schema";
import { Model } from "./model";

test("defines user model out of schema", () => {
  // Initialize schema for user
  const schema: Schema = {
    name: { type: "int", required: false },
    age: { type: "string", required: false },
    email: String,
  };
  // Define model for user
  const model = new Model("User", schema);
  // Test basic attributes
  expect(model.name).toBe("User");
  expect(model.schema).toEqual(schema);
  // Define (User) document constructor out of model
  const User = model.document;
  // Create user
  const user = new User({ name: "Foo", age: 13, email: 15 });
  // Test user constructor
  expect(user.properties.name).toEqual("Foo");
  expect(user.properties.age).toEqual(13);
  expect(user.properties.email).toBeTruthy();
});
