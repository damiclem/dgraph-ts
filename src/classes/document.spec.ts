import { Model } from "./model";
import { Integer, String } from "./schema";
import { Connection } from "./connection";
import { find } from "./document";

test("test document lifecycle", async () => {
  // Initialize connection
  const connection = new Connection([{ uri: "localhost:9080" }], true);
  // Define user model
  const model = new Model(
    "Car",
    { model: String, brand: String, year: Integer },
    connection
  );
  // Set types and indices
  await model.setTypeAndIndices(true);

  // // Define car constructor
  // const Car = model.document;
  // // Define car instance
  // const saved = new Car({ model: "Cosworth", brand: "Ford" });
  // // Store document into database
  // await saved.save();
  // // Expect document UID to be set
  // expect(saved.uid).toBeTruthy();
  //
  // // Search for saved instance
  // const cars = await model.find();
  // // Expect documents list to not be empty
  // expect(cars).toBeTruthy();

  // Define car constructor
  const Car = model.document;
  // Search for car instances saved in DGraph database
  const cars = await find(model);
});
