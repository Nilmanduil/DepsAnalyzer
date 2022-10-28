import fs from "fs";
import path from "path";

/**
 * Returns the filtered content of a package.json file
 *
 * @param {string} jsonPath path to a package.json file
 * @param {boolean} includeWorkspaces embed workspaces field, default true
 * @returns {object} filtered package.json content (name, version, workspaces, dependencies, devDependencies, peerDependencies, optionalDependencies, bundleDependencies)
 */
export const readPackageJson = (jsonPath, includeWorkspaces = true) => {
  const propsToKeep = [
    "name",
    "version",
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

export const SUBDIRECTORIES_DEFAULT_EXCLUDE_LIST = [
  ".bin",
  ".cache",
  "node_modules",
];

/**
 * Returns a list of all installed dependencies' package.json paths
 *
 * @param {string} dirPath
 * @param {number} depth
 * @param {object} options
 * @returns {String[]} list of all dependencies' package.json paths
 */
export const listPackageJsonFiles = (
  dirPath = "node_modules",
  depth = 0,
  options = {
    maxDepth: 2,
    exclude: SUBDIRECTORIES_DEFAULT_EXCLUDE_LIST,
  }
) => {
  const defaultOptions = {
    maxDepth: 2,
    exclude: SUBDIRECTORIES_DEFAULT_EXCLUDE_LIST,
  };
  const opts = { ...defaultOptions, ...options };
  let allPackageJSONPaths = [];

  try {
    const directory = fs.readdirSync(dirPath, { withFileTypes: true });
    let subdirectories = directory
      .filter(
        (element) =>
          element.isDirectory() && opts.exclude.indexOf(element.name) === -1
      )
      .map((element) => path.join(dirPath, element.name));
    let hasPackageJson =
      directory.filter((element) => element.name === "package.json").length > 0;

    if (hasPackageJson)
      allPackageJSONPaths.push(path.join(dirPath, "package.json"));

    subdirectories.forEach((dir) => {
      if (depth < opts.maxDepth) {
        allPackageJSONPaths = [
          ...allPackageJSONPaths,
          ...listPackageJsonFiles(dir, depth + 1, opts),
        ];
      }
    });
  } catch (err) {
    console.error(err);
    throw new Error(err.message);
  }

  return allPackageJSONPaths;
};

/**
 * Write content to a file
 *
 * @param {string} path
 * @param {string} content
 * @param {sring} mode
 */
export const writeOutputFile = (path, content, mode = "w") => {
  try {
    fs.writeFileSync(path, content, { flag: mode });
  } catch (err) {
    console.error(err);
    throw new Error(err.message);
  }
};
