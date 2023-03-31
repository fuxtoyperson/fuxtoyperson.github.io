import * as sic from './sic.jsx'  
import * as objfile from './objfile.jsx'
import * as sicasmparser from './sicasmparser.jsx'
function processBYTEC(operand) {
  let constant = "";
  for (let i = 2; i < operand.length - 1; i++) {
    let tmp = parseInt(operand.charCodeAt(i)).toString(16);
    tmp = tmp.length === 1 ? "0" + tmp : tmp;
    tmp = tmp.toUpperCase();
    constant += tmp;
  }
  return constant;
}

function generateInstruction(opcode, operand, SYMTAB) {
  let instruction = sic.OPTAB[opcode] * 65536;
  if (operand !== null) {
    if (operand.slice(-2) === ",X") {
      instruction += 32768;
      operand = operand.slice(0, -2);
    }
    if (SYMTAB.hasOwnProperty(operand)) {
      instruction += parseInt(SYMTAB[operand]);
    } else {
      return "";
    }
  }
  return objfile.hexstrToWord(instruction.toString(16));
}
export function Pass1(lines) {
  let STARTING = 0
  let LOCCTR = 0
  let proglen = 0
  let SYMTAB = {}
  lines = lines.split('\n')
  for (let line of lines) {
    let t = sicasmparser.decompositLine(line)

    if (t == (null, null, null)) {
      continue
    }
    if (t[1] == "START") {
      STARTING = parseInt(t[2], 16)
      LOCCTR = parseInt(STARTING)
    }

    if (t[1] == "END") {
      proglen = parseInt(LOCCTR - STARTING)
      break
    }

    if (t[0] != null) {
      if (t[0] in SYMTAB) {
        console.log("Your assembly code has problem.")
        continue
      }
      SYMTAB[t[0]] = LOCCTR
    }

    if (sic.isInstruction(t[1]) == true) {
      LOCCTR = LOCCTR + 3
    } else if (t[1] == "WORD") {
      LOCCTR = LOCCTR + 3
    } else if (t[1] == "RESW") {
      LOCCTR = LOCCTR + (parseInt(t[2]) * 3)
    } else if (t[1] == "RESB") {
      LOCCTR = LOCCTR + parseInt(t[2])
    } else if (t[1] == "BYTE") {
      if (t[2][0] == 'C') {
        LOCCTR = LOCCTR + (t[2].length - 3)
      }
      if (t[2][0] == 'X') {
        LOCCTR = LOCCTR + ((t[2].length - 3) / 2)
      }
    }
  }
  return {SYMTAB,proglen}
}