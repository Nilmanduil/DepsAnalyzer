#!/usr/bin/env node

import { program, Option } from "commander";
import { Listr } from "listr2";

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
      "if the program is a monorepo, analyze workspaces as well"
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
  .option(
    "-f <format>, --format <format>",
    "format of the output (JSON or CSV)",
    "json"
  )
  .option("-o <file>, --output <file>", "output of the analyze", "stdout")
  .argument("[directory]", "path of the project to analyze", ".")
  .action((directory, options, command) =>
    console.warn({ directory, options, command })
  )
  .parse();
