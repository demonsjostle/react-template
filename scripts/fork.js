const fs = require("fs");
const path = require("path");
const readline = require("readline");

// ANSI Escape Codes สำหรับสี
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

// ฟังก์ชันสำหรับรับค่าจาก input
const askQuestion = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    }),
  );
};

// ฟังก์ชันตรวจสอบ version
const isValidVersion = (version) => {
  const versionRegex = /^\d+(\.\d+)?(\.\d+)?$/; // รองรับ 1, 1.0, 1.0.0
  return versionRegex.test(version);
};

// ฟังก์ชันแก้ไข package.json
const editPackageJson = async () => {
  const packageJsonPath = path.resolve("package.json");

  if (!fs.existsSync(packageJsonPath)) {
    console.error(
      `${colors.red}package.json not found. Please ensure the file exists.${colors.reset}`,
    );
    return;
  }

  try {
    const packageJsonContent = fs.readFileSync(packageJsonPath, "utf-8");
    let packageJson = JSON.parse(packageJsonContent);

    const newName = await askQuestion(
      `${colors.cyan}Enter new name (current: ${packageJson.name}): ${colors.reset}`,
    );

    let newVersion;
    while (true) {
      newVersion = await askQuestion(
        `${colors.cyan}Enter new version (current: ${packageJson.version}): ${colors.reset}`,
      );
      if (!newVersion || isValidVersion(newVersion)) break;
      console.log(
        `${colors.red}Invalid version format. Use formats like 1, 1.0, or 1.0.0.${colors.reset}`,
      );
    }

    const newDescription = await askQuestion(
      `${colors.cyan}Enter new description (current: ${packageJson.description}): ${colors.reset}`,
    );

    const currentRepository = packageJson.repository;
    const newRepository = await askQuestion(
      `${colors.cyan}Enter new repository (current: ${currentRepository}): ${colors.reset}`,
    );

    // ตรวจสอบ repository และรีเซ็ตค่า
    if (
      currentRepository ===
        "https://github.com/demonsjostle/react-template.git" &&
      !newRepository
    ) {
      console.log(
        `${colors.yellow}⚠️ Repository reset to empty because it matches the default and no new value was provided.${colors.reset}`,
      );
      packageJson.repository = "";
    } else {
      packageJson.repository = newRepository || currentRepository;
    }

    const currentAuthor = packageJson.author;
    const newAuthor = await askQuestion(
      `${colors.cyan}Enter new author (current: ${currentAuthor}): ${colors.reset}`,
    );

    // ตรวจสอบ author และรีเซ็ตค่า
    if (currentAuthor === "@demonsjostle" && !newAuthor) {
      console.log(
        `${colors.yellow}⚠️ Author reset to empty because it matches the default and no new value was provided.${colors.reset}`,
      );
      packageJson.author = "";
    } else {
      packageJson.author = newAuthor || currentAuthor;
    }

    const newLicense = await askQuestion(
      `${colors.cyan}Enter new license (current: ${packageJson.license}): ${colors.reset}`,
    );

    // เพิ่ม root_repository ก่อน scripts
    if (!packageJson.root_repository) {
      console.log(
        `${colors.green}Adding "root_repository" before "scripts".${colors.reset}`,
      );
      const reorderedPackageJson = {};
      Object.keys(packageJson).forEach((key) => {
        if (key === "scripts") {
          reorderedPackageJson["root_repository"] =
            "https://github.com/demonsjostle/react-template.git"; // เพิ่ม root_author ก่อน dependencies
        }
        reorderedPackageJson[key] = packageJson[key];
      });
      packageJson = reorderedPackageJson; // อัปเดต Object
    }

    // เพิ่ม root_author ก่อน scripts
    if (!packageJson.root_author) {
      console.log(
        `${colors.green}Adding "root_author": "@demonsjostle" before "scripts".${colors.reset}`,
      );
      const reorderedPackageJson = {};
      Object.keys(packageJson).forEach((key) => {
        if (key === "scripts") {
          reorderedPackageJson["root_author"] = "@demonsjostle"; // เพิ่ม root_author ก่อน dependencies
        }
        reorderedPackageJson[key] = packageJson[key];
      });
      packageJson = reorderedPackageJson; // อัปเดต Object
    }

    packageJson.name = newName || packageJson.name;
    packageJson.version = newVersion || packageJson.version;
    packageJson.description = newDescription || packageJson.description;
    packageJson.license = newLicense || packageJson.license;

    const updatedContent = JSON.stringify(packageJson, null, 2);
    fs.writeFileSync(packageJsonPath, updatedContent, "utf-8");

    console.log(
      `${colors.green}✅ Updated package.json successfully!${colors.reset}`,
    );
  } catch (error) {
    console.error(
      `${colors.red}❌ Failed to edit package.json: ${error.message}${colors.reset}`,
    );
  }
};

// ฟังก์ชันตรวจสอบ Remote URL
const checkGitRemoteURL = () => {
  const gitConfigPath = path.resolve(".git/config");
  if (fs.existsSync(gitConfigPath)) {
    const gitConfigContent = fs.readFileSync(gitConfigPath, "utf-8");
    return gitConfigContent.includes(
      "https://github.com/demonsjostle/react-template.git",
    );
  }
  return false;
};

// ฟังก์ชันลบ .git
const removeGitFolder = () => {
  const gitPath = path.resolve(".git");
  if (fs.existsSync(gitPath)) {
    console.log(`${colors.yellow}🗑️  Removing .git folder...${colors.reset}`);
    fs.rmSync(gitPath, { recursive: true, force: true });
    console.log(
      `${colors.green}✅ .git folder removed successfully.${colors.reset}`,
    );
  } else {
    console.log(
      `${colors.blue}ℹ️ No .git folder found. Skipping removal.${colors.reset}`,
    );
  }
};

// ฟังก์ชันหลัก
const setup = async () => {
  try {
    await editPackageJson();

    if (checkGitRemoteURL()) {
      console.log(
        `${colors.cyan}🔗 Remote URL matches default repository. Removing .git...${colors.reset}`,
      );
      removeGitFolder();
    } else {
      console.log(
        `${colors.blue}ℹ️ Remote URL does not match default. Skipping .git removal.${colors.reset}`,
      );
    }
  } catch (error) {
    console.error(
      `${colors.red}❌ Setup failed: ${error.message}${colors.reset}`,
    );
  }
};

// รันฟังก์ชัน
setup();
