const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createLookupObj = (array, keyStr, valueStr) => {
  if (array.length === 0) return {};
  const lookupObj = {};
  lookupObj[array[0][keyStr]] = array[0][valueStr];
  return lookupObj;
};



