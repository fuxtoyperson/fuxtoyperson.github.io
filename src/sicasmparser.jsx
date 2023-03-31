import * as sic from "./sic.jsx"


export function decompositLine(line) {
  if (line.length > 0) {
    if (line[0] == '.') {
      return [null, null, null];
    }
    if (line[0] == '\n') {
      return [null, null, null];
    }
  }
  const token_before = line.split(/\s+/);
  const tokens = token_before.filter(function(item) {
  return item !== '';});
  if (tokens.length == 1) {
    if (isOpcodeOrDirective(tokens[0]) == false) {
      console.log("Your assembly code has problem in decomposit");
      return [null, null, null];
    }
    return [null, tokens[0], null];
  } else if (tokens.length == 2) {
    if (isOpcodeOrDirective(tokens[0]) == true) {
      return [null, tokens[0], tokens[1]];
    } else if (isOpcodeOrDirective(tokens[1]) == true) {
      return [tokens[0], tokens[1], null];
    } else {
      console.log("Your assembly code has problem.");
      return [null, null, null];
    }
  } else if (tokens.length == 3) {
    if (isOpcodeOrDirective(tokens[1]) == true) {
      return [tokens[0], tokens[1], tokens[2]];
    } else {
      console.log("Your assembly code has problem.");
      return [null, null, null];
    }
  }
  return [null, null, null];
}

export function isOpcodeOrDirective(token) {
  if (sic.isInstruction(token) == true) {
    return true;
  }
  if (sic.isDirective(token) == true) {
    return true;
  }
  return false;
}