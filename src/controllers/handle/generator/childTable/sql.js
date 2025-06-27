const create = (json) => {
  // 字段
  let fieldStr = "";
  json.fields.forEach((field) => {
    fieldStr += `  ${field.key} ${field.type},
`;
  });
  return `
    CREATE TABLE IF NOT EXISTS ${json.key} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      ${fieldStr}
    );
  `;
};
export default create;
