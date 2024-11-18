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

// ฟังก์ชันสำหรับสร้างหรือเขียนไฟล์
const writeFile = (filePath, content) => {
  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`File created/updated: ${filePath}`);
};

// ฟังก์ชันสำหรับแก้ไข Webpack Config
const editWebpackConfig = () => {
  const recast = require("recast");
  const webpackConfigPath = path.resolve("config/webpack.common.ts");

  if (!fs.existsSync(webpackConfigPath)) {
    console.error(
      "Webpack config file not found at 'config/webpack.common.ts'. Please ensure the file exists.",
    );
    return;
  }

  const webpackConfigContent = fs.readFileSync(webpackConfigPath, "utf-8");

  try {
    const ast = recast.parse(webpackConfigContent);

    let scssRuleFound = false;

    recast.types.visit(ast, {
      visitObjectExpression(path) {
        const properties = path.node.properties;

        // ค้นหา module.rules array
        const moduleRules = properties
          .find((prop) => prop.key.name === "module")
          ?.value?.properties?.find((prop) => prop.key.name === "rules")?.value;

        if (moduleRules?.elements) {
          // ค้นหา rule ที่ test: /\.(sa|sc|c)ss$/
          moduleRules.elements.forEach((element) => {
            const testProperty = element.properties.find(
              (prop) => prop.key.name === "test",
            );

            if (
              testProperty &&
              testProperty.value.type === "Literal" &&
              testProperty.value.regex &&
              testProperty.value.regex.pattern.includes("(sa|sc|c)ss$")
            ) {
              const useProperty = element.properties.find(
                (prop) => prop.key.name === "use",
              );

              if (useProperty?.value?.elements) {
                const useArray = useProperty.value.elements;
                const hasPostCSSLoader = useArray.some(
                  (loader) => loader.value === "postcss-loader",
                );

                if (!hasPostCSSLoader) {
                  console.log("Adding 'postcss-loader' to SCSS/CSS rule...");
                  const postCSSLoaderNode =
                    recast.types.builders.literal("postcss-loader");
                  useArray.splice(
                    useArray.findIndex(
                      (loader) => loader.value === "css-loader",
                    ) + 1,
                    0,
                    postCSSLoaderNode,
                  );
                  scssRuleFound = true;
                } else {
                  console.log("'postcss-loader' is already present.");
                }
              }
            }
          });
        }

        return false; // หยุดการ traverse
      },
    });

    if (!scssRuleFound) {
      console.error("Could not find SCSS/CSS rule in Webpack config.");
      return;
    }

    const updatedWebpackConfigContent = recast.print(ast).code;
    writeFile(webpackConfigPath, updatedWebpackConfigContent);
    console.log("Updated Webpack config file successfully.");
  } catch (error) {
    console.log("Failed to parse Webpack config:", error.message);
  }
};

// ฟังก์ชันสำหรับเพิ่มการ import ใน index.tsx
const editIndexTsx = () => {
  const indexTsxPath = path.resolve("src/index.tsx");
  const importStatement = `import "./App.css";\n`;

  if (!fs.existsSync(indexTsxPath)) {
    console.error("src/index.tsx not found. Please ensure this file exists.");
    return;
  }

  const content = fs.readFileSync(indexTsxPath, "utf-8");

  if (!content.includes(importStatement.trim())) {
    console.log("Adding \"import './App.css'\" to src/index.tsx...");
    const updatedContent = importStatement + content;
    writeFile(indexTsxPath, updatedContent);
  } else {
    console.log('"./App.css" is already imported in src/index.tsx.');
  }
};

// ฟังก์ชันหลัก
const setupTailwind = async () => {
  try {
    // 1. ติดตั้ง dependencies
    console.log("Installing TailwindCSS and related dependencies...");
    await runCommand(
      "yarn add tailwindcss postcss postcss-loader autoprefixer recast --dev",
    );

    // 2. สร้างไฟล์ tailwind.config.js
    console.log("Initializing TailwindCSS...");
    await runCommand("npx tailwindcss init");

    // 3. ปรับปรุงไฟล์ tailwind.config.js
    const tailwindConfigPath = path.resolve("tailwind.config.js");
    const tailwindConfigContent = `module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};`;
    writeFile(tailwindConfigPath, tailwindConfigContent);

    // 4. สร้างไฟล์ postcss.config.js
    const postcssConfigPath = path.resolve("postcss.config.js");
    const postcssConfigContent = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`;
    writeFile(postcssConfigPath, postcssConfigContent);

    // 5. แก้ไขไฟล์ src/App.css
    const appCssPath = path.resolve("src/App.css");
    const tailwindDirectives = `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n`;

    if (!fs.existsSync(appCssPath)) {
      console.log("src/App.css not found. Creating a new file...");
      writeFile(appCssPath, tailwindDirectives);
    } else {
      const appContent = fs.readFileSync(appCssPath, "utf-8");
      if (!appContent.includes("@tailwind base;")) {
        console.log("Adding Tailwind directives to src/App.css...");
        const updatedAppContent = tailwindDirectives + appContent;
        writeFile(appCssPath, updatedAppContent);
      } else {
        console.log("Tailwind directives already exist in src/App.css.");
      }
    }

    // 6. เพิ่มการ import "./App.css" ใน index.tsx
    editIndexTsx();

    // 7. แก้ไข Webpack Config
    editWebpackConfig();

    console.log("TailwindCSS setup completed successfully!");
  } catch (error) {
    console.error("Failed to setup TailwindCSS:", error.message);
  }
};

// รันฟังก์ชัน
setupTailwind();
