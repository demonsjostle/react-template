const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

// ฟังก์ชันสำหรับรันคำสั่ง Shell
const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${stderr}`);
        reject(error);
        return;
      }
      console.log(stdout);
      resolve();
    });
  });
};

// ฟังก์ชันสำหรับเพิ่ม Babel Plugin
const addBabelPlugin = (pluginName) => {
  const babelConfigPath = path.join(__dirname, "../../babel.config.js");

  if (!fs.existsSync(babelConfigPath)) {
    console.error("Babel config file not found!");
    return;
  }

  try {
    // อ่านไฟล์ babel.config.js เป็นข้อความ
    let babelConfigContent = fs.readFileSync(babelConfigPath, "utf-8");

    // ตรวจสอบว่าปลั๊กอินมีอยู่แล้วหรือไม่
    if (babelConfigContent.includes(pluginName)) {
      console.log(`${pluginName} is already in Babel plugins.`);
      return;
    }

    // ใช้ Regular Expression เพื่อเพิ่มปลั๊กอินในส่วน `plugins`
    const pluginRegex = /plugins:\s*\[(.*?)\]/s; // หา `plugins: [...]`
    babelConfigContent = babelConfigContent.replace(
      pluginRegex,
      (match, plugins) => {
        const updatedPlugins = plugins
          ? `${plugins}, "${pluginName}"`
          : `"${pluginName}"`;
        return `plugins: [${updatedPlugins}]`;
      },
    );

    // เขียนไฟล์กลับ
    fs.writeFileSync(babelConfigPath, babelConfigContent, "utf-8");
    console.log(`Added ${pluginName} to Babel plugins.`);
  } catch (error) {
    console.error(`Failed to update Babel config: ${error.message}`);
  }
};

// ฟังก์ชันหลัก
const installStyledComponents = async () => {
  try {
    console.log("Installing styled-components...");
    await runCommand("yarn add styled-components");
    console.log("Installing @types/styled-components...");
    await runCommand("yarn add -D @types/styled-components");
    console.log("Installing babel-plugin-styled-components...");
    await runCommand("yarn add -D babel-plugin-styled-components");

    // เพิ่ม babel-plugin-styled-components ใน Babel config
    addBabelPlugin("babel-plugin-styled-components");

    console.log(
      "All dependencies installed and Babel configured successfully!",
    );
  } catch (error) {
    console.error("Failed to complete installation and configuration.");
  }
};

// รันฟังก์ชัน
installStyledComponents();
