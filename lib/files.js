import fs from "fs";

/**
 *
 * @param {string} jsonPath path to a package.json file
 * @returns {object} filtered package.json content (name, workspaces, dependencies, devDependencies, peerDependencies)
 */
export const readPackageJson = (jsonPath) => {
  const propsToKeep = [
    "name",
    "workspaces",
    "dependencies",
    "devDependencies",
    "peerDependencies",
    "optionalDependencies",
    "bundleDependencies",
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

export const writeOutputFile = (path, content, mode = "w") => {
  try {
    fs.writeFileSync(path, content, { flag: mode });
  } catch (err) {
    console.error(err);
    throw new Error(err.message);
  }
};
