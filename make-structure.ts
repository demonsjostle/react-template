const fs = require("fs");
const path = require("path");

const createFolder = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`Folder created: ${folderPath}`);
  } else {
    console.log(`Folder already exists: ${folderPath}`);
  }
};

const foldersToCreate = [
  path.join(__dirname, "/src/assets"),
  path.join(__dirname, "/src/components"),
  path.join(__dirname, "/src/layouts"),
  path.join(__dirname, "/src/pages"),
  path.join(__dirname, "/src/routes"),
  path.join(__dirname, "/src/services"),
];

foldersToCreate.forEach(createFolder);
