import camelcaseKeys from "camelcase-keys";

const dataFromDb = { first_name: "John", last_name: "Doe" };
const camelCaseData = camelcaseKeys(dataFromDb);

console.log(camelCaseData); // { firstName: 'John', lastName: 'Doe' }
