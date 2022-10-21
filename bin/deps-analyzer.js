#!/usr/bin/env node

import { program, Option } from "commander";
import { Listr } from "listr2";
import delay from "delay";
import path from "path";
import fs from "fs";

program
  .name("deps-analyzer")
  .description(
    "A Node.js CLI to list dependencies and fetch informations from NPM registry"
  )
  .version("0.1.0")
  .addOption(
    new Option(
      "-p <packager>, --packager <packager>",
      "whether to use NPM, Yarn or automatic detection"
    )
      .choices(["yarn", "npm", "auto"])
      .default("auto")
  )
  .addOption(
    new Option(
      "-w, --workspaces",
      "if the project is a monorepo, analyze workspaces as well"
    )
      .default(true)
      .implies({ packager: "yarn" })
  )
  .option(
    "-a, --audit",
    "includes a 'yarn audit' or 'npm audit' during analyze to include security status",
    true
  )
  .addOption(
    new Option(
      "-l <level>, --level <level>",
      "security level passed to Yarn/NPM audit"
    )
      .default("warning")
      .implies({ audit: true })
  )
  .option("-v, --verbose", "display debugging informations", false)
  .addOption(new Option("-c, --color").hideHelp().default(true))
  .addOption(
    new Option("-n, --no-color", "format output with no color").default(false)
  )
  .option(
    "-f <format>, --format <format>",
    "format of the output (JSON or CSV)",
    "json"
  )
  .addOption(
    new Option("-s <char>, --separator <char>", "separator for columns")
      .implies({ format: "csv" })
      .default(";")
  )
  .option("-o <file>, --output <file>", "output of the analyze", "stdout")
  .argument("[directory]", "path of the project to analyze", ".")
  .action(async (directory, options, command) => {
    const {
      p: packagerOption,
      workspaces,
      audit,
      l: level,
      verbose,
      f: format,
      s: separator,
      o: output,
      color,
    } = options;
    const noColor = !color;

    const readPackageJson = (jsonPath, filter = true) => {
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

    const parseDependencies = (
      dependencies,
      type = "runtime",
      from = "root"
    ) => {
      let result = {};
      Object.keys(dependencies).forEach((key) => {
        const version = /([~^])?(\d+)\.(\d+|\*).(\d+|\*)[-._]*(.*)$/.exec(
          dependencies[key]
        );
        const parseVersionNumber = (subversion) => {
          if (/^\d+$/.test(subversion)) return parseInt(subversion);
          return subversion;
        };

        const current = {
          name: key,
          version: dependencies[key],
          versionMajor: !!version ? parseVersionNumber(version[2]) : null,
          versionMinor: !!version ? parseVersionNumber(version[3]) : null,
          versionPatch: !!version ? parseVersionNumber(version[4]) : null,
          versionOther: !!version ? parseVersionNumber(version[5]) : null,
          isFixed: /^\d/.test(dependencies[key]),
          isWildcard: dependencies[key] === "*",
          from,
          type,
        };
        result = { ...result, [key]: current };
      });
      return result;
    };

    const addPackageJsonInfos = (json) => {};

    // TODO remove when adding packager detection
    const packager = "yarn";
    const monorepo = false;

    if (verbose) {
      console.warn({
        directory,
        options,
        command,
        packager,
        workspaces,
        audit,
        level,
        verbose,
        format,
        separator,
        output,
        color,
        noColor,
      });
    }

    let dependencies = {};

    const tasks = new Listr([
      {
        title: "Parsing root package.json file",
        task: (ctx, task) => {
          const rootPackageJsonPath = path.join(directory, "package.json");
          const rootPackageJson = readPackageJson(rootPackageJsonPath);
          ctx.rootPackageJsonPath = rootPackageJsonPath;
          ctx.rootPackageJson = rootPackageJson;
        },
      },
      {
        title: "Parsing packages package.json files",
        skip: !monorepo,
        task: (ctx, task) => {},
      },
      {
        title: "Checking installed versions",
        task: (ctx, task) => {},
      },
      {
        title: "Fetching info from NPM registry",
        task: (ctx, task) => {},
      },
      {
        title: "Fetching security info",
        task: (ctx, task) => {},
      },
      {
        title: "Displaying output",
        task: async (ctx, task) => {
          task.output = JSON.stringify(
            {
              deps: parseDependencies(ctx.rootPackageJson.dependencies),
              devDeps: parseDependencies(
                ctx.rootPackageJson.devDependencies,
                "dev"
              ),
              peerDeps: parseDependencies(
                ctx.rootPackageJson.peerDependencies,
                "peer"
              ),
            },
            null,
            2
          );
          await delay(500);
        },
        options: { persistentOutput: true, bottomBar: Infinity },
      },
    ]);

    const ctx = await tasks.run();
  })
  .parse();
