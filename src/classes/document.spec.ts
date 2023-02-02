import { Model } from "./model";
import { Integer, String } from "./schema";
import { Connection } from "./connection";

test("test document lifecycle", async () => {
  // Initialize connection
  const connection = new Connection([{ uri: "localhost:9080" }], true);
  // Define user model
  const model = new Model("User", { name: String, age: Integer }, connection);
  // Define user constructor
  const User = model.document;
  // Define user instance
  const user = new User({ name: "Carlo", age: 42 });
  // Store user into database
  await user.save();
  // Expect user UID to be set
  expect(user.uid).toBeTruthy();
  // Delete car from database
  await user.delete();
});
