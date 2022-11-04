export const parseVersionNumber = (subversion) => {
  if (/^\d+$/.test(subversion)) return parseInt(subversion);
  return subversion;
};

export const parseVersion = (versionString) => {
  const version = /([~^])?(\d+)\.(\d+|\*).(\d+|\*)[-._]*(.*)$/.exec(
    versionString
  );

  return {
    versionMajor: !!version ? parseVersionNumber(version[2]) : null,
    versionMinor: !!version ? parseVersionNumber(version[3]) : null,
    versionPatch: !!version ? parseVersionNumber(version[4]) : null,
    versionOther: !!version && !!version[5] ? version[5] : null,
  };
};

export const parseDependencies = (
  dependencies,
  type = "runtime",
  from = "root"
) => {
  let result = {};
  Object.keys(dependencies).forEach((key) => {
    const version = parseVersion(dependencies[key]);

    const current = {
      name: key,
      version: dependencies[key],
      versionMajor: version.versionMajor,
      versionMinor: version.versionMinor,
      versionPatch: version.versionPatch,
      versionOther: version.versionOther,
      isFixed: /^\d/.test(dependencies[key]),
      isWildcard: dependencies[key] === "*",
      from,
      type,
    };
    result = { ...result, [key]: current };
  });
  return result;
};
