const create = (json) => {
  let dataStr = "";
  json.fields.forEach((field) => {
    dataStr += `  ${field.key} VARCHAR (255) COMMENT '${field.label}',\n`;
  });
  return `CREATE TABLE IF NOT EXISTS ${json.key} (
  id INT AUTO_INCREMENT PRIMARY KEY,
${dataStr}  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);`;
};
export default create;
