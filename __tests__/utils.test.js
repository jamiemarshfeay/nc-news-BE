const {
  convertTimestampToDate,
  createLookupObj,
} = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("createLookupObj", () => {
  test("returns an empty object when passed an empty array", () => {
    const testArray = [];

    const output = createLookupObj(testArray);

    expect(output).toEqual({});
  });
  test("returns an object containing a single property, with the key and value matching the respective strings, when passed two strings alongside an array containing a single object", () => {
    const testArray = [{ name: "Jamie", age: 21, favFood: "steak" }];
    const testKey = "name";
    const testValue = "favFood";

    const output = createLookupObj(testArray, testKey, testValue);

    expect(output).toEqual({ Jamie: "steak" });
  });
  test("returns an object containing multiple properties, with the keys and values matching the respective strings, when passed two strings alongside an array containing multiple objects", () => {
    const testArray = [
      { name: "Jamie", age: 21, favFood: "steak" },
      { name: "Amelia", age: 12, favFood: "McDonalds's" },
      { name: "Nicola", age: 44, favFood: "shoestring fries" },
    ];
    const testKey = "age";
    const testValue = "name";

    const output = createLookupObj(testArray, testKey, testValue);

    expect(output).toEqual({ 21: "Jamie", 12: "Amelia", 44: "Nicola" });
  });
  test("tests that the array passed is not mutated when the function is invoked", () => {
    const testArray = [
      { name: "Jamie", age: 21, favFood: "steak" },
      { name: "Amelia", age: 12, favFood: "McDonalds's" },
      { name: "Nicola", age: 44, favFood: "shoestring fries" },
    ];
    const copyTestArray = [
      { name: "Jamie", age: 21, favFood: "steak" },
      { name: "Amelia", age: 12, favFood: "McDonalds's" },
      { name: "Nicola", age: 44, favFood: "shoestring fries" },
    ];
    const testKey = "name";
    const testValue = "favFood";

    createLookupObj(testArray, testKey, testValue);

    expect(testArray).toEqual(copyTestArray);
  });
});
