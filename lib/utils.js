/**
 *
 * @param {*} jsonValue element to format
 * @param {string} jsonKey key of the element to format
 * @param {object} opts options
 * @param {*} indentationLevel level of indentation for the current line
 * @param {*} isLastElement whether the element is the last of the parent element
 * @returns
 */
export const formatJSON = (
  jsonValue,
  jsonKey = null,
  opts = {},
  indentationLevel = 0,
  isLastElement = false
) => {
  const defaultOptions = {
    indentationChar: "  ", // Two spaces by default
    carriageReturnChar: "\n", // Unix style by default
    color: false, // TODO
    escapeChars: true, // TODO
    displayNull: true,
    displayUndefined: true,
    parseNumbers: true,
    maxWidth: 100, // TODO
  };
  const options = { ...defaultOptions, ...opts };
  let indents = "";
  for (let i = 0; i < indentationLevel; i += 1) {
    indents += options.indentationChar;
  }

  let output = "";
  const endLineComma = !isLastElement && indentationLevel > 0;

  switch (typeof jsonValue) {
    case "object":
      switch (jsonValue) {
        case undefined:
          if (options.displayUndefined) {
            output += `${indents}${
              jsonKey ? '"' + jsonKey + '": ' : ""
            }undefined${endLineComma ? "," : ""}${options.carriageReturnChar}`;
          }
          break;
        case null:
          if (options.displayNull) {
            output += `${indents}${jsonKey ? '"' + jsonKey + '": ' : ""}null${
              endLineComma ? "," : ""
            }${options.carriageReturnChar}`;
          }
          break;
        default:
          if (Array.isArray(jsonValue)) {
            output += `${indents}${jsonKey ? '"' + jsonKey + '": ' : ""}[${
              options.carriageReturnChar
            }`;

            jsonValue.forEach((key, index, keys) => {
              output += formatJSON(
                key,
                undefined,
                options,
                indentationLevel + 1,
                index === keys.length - 1
              );
            });

            output += `${indents}]${endLineComma ? "," : ""}${
              options.carriageReturnChar
            }`;
          } else {
            const keys = Object.keys(jsonValue);

            output += `${indents}${jsonKey ? '"' + jsonKey + '": ' : ""}{${
              options.carriageReturnChar
            }`;

            keys.forEach((key, index, keys) => {
              output += formatJSON(
                jsonValue[key],
                key,
                options,
                indentationLevel + 1,
                index === keys.length - 1
              );
            });

            output += `${indents}}${endLineComma ? "," : ""}${
              options.carriageReturnChar
            }`;
          }
          break;
      }
      break;
    case "string":
      output += `${indents}${
        jsonKey ? '"' + jsonKey + '": ' : ""
      }"${jsonValue}"${endLineComma ? "," : ""}${options.carriageReturnChar}`;
      break;
    case "number":
      output += `${indents}${jsonKey ? '"' + jsonKey + '": ' : ""}${
        options.parseNumbers ? "" : '"'
      }${jsonValue}${options.parseNumbers ? "" : '"'}${
        endLineComma ? "," : ""
      }${options.carriageReturnChar}`;
      break;
    default:
      output += `${indents}${jsonKey ? '"' + jsonKey + '": ' : ""}${jsonValue}${
        endLineComma ? "," : ""
      }${options.carriageReturnChar}`;
  }

  return output;
};
