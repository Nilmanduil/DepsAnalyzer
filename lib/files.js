import fs from "fs";

export const readPackageJson = (jsonPath, filter = true) => {
  const propsToKeep = [
    "name",
    "workspaces",
    "dependencies",
    "devDependencies",
    "peerDependencies",
  ];

  if (/package.json$/.test(jsonPath)) {
    try {
      const packageJsonRawValue = fs.readFileSync(jsonPath);
      const json = JSON.parse(packageJsonRawValue);
      const result = {};
      propsToKeep.forEach((prop) => {
        result[prop] = json[prop] || {};
      });
      return result;
    } catch (err) {
      console.error(err);
      throw new Error(err.message);
    }
  }
};
