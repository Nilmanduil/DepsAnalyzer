export const parseDependencies = (
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