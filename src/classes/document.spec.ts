import { Model } from "./model";
import { Integer, String } from "./schema";
import { Connection } from "./connection";

test("test document lifecycle", async () => {
  // Initialize connection
  const connection = new Connection([{ uri: "localhost:9080" }], true);
  // Define model fro Car
  const model = new Model(
    "Car",
    { model: String, brand: String, year: Integer },
    connection
  );

  // Define car constructor
  const Car = model.document;
  // Test car construction
  const car1 = new Car({ brand: "", year: 11, model: "" });
  const car2 = Car.fromJson({});
  car1.properties.model;
  car2.properties.brand;
});
