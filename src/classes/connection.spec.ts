import { Connection } from "./connection";

test("Connects to test Dgraph server at localhost", async () => {
  // Define connection
  const connection = new Connection([{ uri: "localhost:9080" }], true);
  // Get client
  const client = connection.client;
  // Test client
  expect(client).toBeTruthy();
  // Create transaction
  const txn = client.newTxn({ readOnly: true });
  // Execute transaction safely
  try {
    // Define query to find any node
    const query = `showAllNodes(func: has(dgraph.type)) {
      dgraph.type
      expand(_all_)
    }`;
    // Get response from DGraph database
    const response = await txn.query(`query all() { ${query} }`);
    // Get results out of response
    const results = response.getJson() as any;
    // Results should contain data
    expect(results).toHaveProperty("showAllNodes");
    // expect(results.data).toHaveProperty("showAllNodes");
    expect(results.showAllNodes).toBeInstanceOf(Array);
    // Check
  } catch (err) {
    // // TODO Remove this
    // console.log(err);
    // There shouldn't be any error
    expect(err).toBeFalsy();
  } finally {
    // Discard transaction
    await txn.discard();
  }
});
