#!/usr/bin/env node

import { program, Option } from "commander";
import { Listr } from "listr2";
import delay from "delay";
import path from "path";

import { readPackageJson, writeOutputFile } from "../lib/files.js";
import { parseDependencies } from "../lib/deps-analyzer.js";
import { formatJSON } from "../lib/utils.js";

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

    const tasks = new Listr(
      [
        {
          title: "Parsing root package.json file",
          task: (ctx, task) => {
            const rootPackageJsonPath = path.join(directory, "package.json");
            const rootPackageJson = readPackageJson(rootPackageJsonPath);
            ctx.root = {
              packageJsonPath: rootPackageJsonPath,
              packageJson: rootPackageJson,
              deps: parseDependencies(rootPackageJson.dependencies),
              devDeps: parseDependencies(
                rootPackageJson.devDependencies,
                "dev"
              ),
              peerDeps: parseDependencies(
                rootPackageJson.peerDependencies,
                "peer"
              ),
              optionalDeps: parseDependencies(
                rootPackageJson.optionalDependencies,
                "optional"
              ),
              bundleDeps: parseDependencies(
                rootPackageJson.bundleDependencies,
                "bundle"
              ),
            };
            ctx.allDependenciesSynthesis = {};
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
            const jsonOutput = formatJSON(ctx);
            if (output && output !== "stdout") {
              writeOutputFile(output, jsonOutput);
            }
            task.output = jsonOutput;
            await delay(800);
          },
          options: {
            persistentOutput: true,
            bottomBar: Infinity,
            showTimer: true,
          },
        },
      ],
      { concurrent: false, renderer: "simple" }
    );

    const ctx = await tasks.run();
  })
  .parse();
