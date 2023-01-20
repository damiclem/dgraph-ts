test("test schema definition", () => {
  // Initialize schema
  const schema = {
    name: { type: "string", required: false },
    age: { type: "int", required: false },
  } as const;
  // Check schema type
  // NOTE At runtime, const assertion is erased!
  expect(typeof schema.name.type === "string").toBeTruthy();
  expect(typeof schema.age.type !== "string").toBeFalsy();
});
