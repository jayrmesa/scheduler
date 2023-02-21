import reducer from "reducers/application";

describe("Application Reducer", () => {
  it("thows an error with an unsupported type", () => {
    const type = "NOT_SUPPORTED"
    expect(() => reducer(null, { type })).toThrowError(
      /tried to reduce with unsupported action type/i);
  });
});