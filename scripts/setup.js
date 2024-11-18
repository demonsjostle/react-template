const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

// ดึง Arguments จาก CLI
const args = process.argv.slice(2);

// ตรวจสอบว่ามีการส่งชื่อไฟล์เข้ามา
if (args.length === 0) {
  console.error("Please provide the file name to run.");
  process.exit(1);
}

const fileName = args[0]; // ชื่อไฟล์ที่ไม่มีนามสกุล เช่น "test"

// ตรวจสอบและค้นหาไฟล์ที่ตรงกับชื่อ
const validExtensions = [".js", ".ts"];
let foundFile = null;

for (const ext of validExtensions) {
  const fullPath = path.resolve(__dirname, `setup/${fileName}${ext}`);
  if (fs.existsSync(fullPath)) {
    foundFile = fullPath;
    break;
  }
}

if (!foundFile) {
  console.error(
    `No valid file found for "${fileName}" with extensions ${validExtensions.join(", ")}.`,
  );
  process.exit(1);
}

// รันไฟล์ที่พบ
const runFile = (file) => {
  console.log(`Running file: ${file}`);
  const command = file.endsWith(".ts") ? `ts-node ${file}` : `node ${file}`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${stderr}`);
      process.exit(1);
    }
    console.log(stdout);
  });
};

runFile(foundFile);
