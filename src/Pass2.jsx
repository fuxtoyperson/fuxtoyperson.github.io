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
  SYMTAB = JSON.parse(SYMTAB) 
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


export function Pass2(lines, SYMTAB, proglen) { 
  let reserveflag = false;
  lines = lines.split('\n');
  let t = sicasmparser.decompositLine(lines[0]);
  let LOCCTR = 0;
  let progname;
  if (t[1] === "START") {
    LOCCTR = parseInt(t[2], 16);
    progname = t[0];
  }
  let STARTING = LOCCTR;
  var file = []
  objfile.writeHeader(file, progname, STARTING, proglen);
  let tline = "";
  let tstart = LOCCTR;
  for (let line of lines) {
    t = sicasmparser.decompositLine(line);
    if (t[1] === null && t[2] === null && t[3] === null) {
      continue;
    }
    if (t[1] === "START") {
      continue;
    }
    if (t[1] === "END") {
      if (tline.length > 0) {
        objfile.writeText(file, tstart, tline);
      }
      let PROGLEN = LOCCTR - STARTING;
      let address = STARTING;
      if (t[2] !== null) {
        SYMTAB = JSON.parse(SYMTAB)
        address = SYMTAB[t[2]];
      }
      const answer = objfile.writeEnd(file, address);
      return answer
      //break;
    }
    if (t[1] in sic.OPTAB) {
      let instruction = generateInstruction(t[1], t[2], SYMTAB);
      if (instruction.length === 0) {
        console.log(`Undefined Symbole: ${t[2]}`);
        break;
      }
      if (LOCCTR + 3 - tstart > 30 || reserveflag === true) {
        objfile.writeText(file, tstart, tline);
        tstart = LOCCTR;
        tline = instruction;
      } else {
        tline += instruction;
      }
      reserveflag = false;
      LOCCTR += 3;
    } else if (t[1] === "WORD") {
      
      let constant = objfile.hexstrToWord(parseInt(t[2]).toString(16));
      if (LOCCTR + 3 - tstart > 30 || reserveflag === true) {
        objfile.writeText(file, tstart, tline);
        tstart = LOCCTR;
        tline = constant;
      } else {
        tline += constant;
      }
      reserveflag = false;
      LOCCTR += 3;
    } else if (t[1] === "BYTE") {
      let operandlen;
      let constant;
      if (t[2][0] === "X") {
        operandlen = parseInt((t[2].length - 3) / 2);
        constant = t[2].slice(2, t[2].length - 1);
      } else if (t[2][0] === "C") {
        operandlen = t[2].length - 3;
        constant = processBYTEC(t[2]);
      }
      if (LOCCTR + 3 - tstart > 30 || reserveflag === true) {
        objfile.writeText(file, tstart, tline);
        tstart = LOCCTR;
        tline = constant;
      } else {
        tline += constant;
      }
      reserveflag = false;
      LOCCTR += operandlen;
    } else if (t[1] === "RESB") {
      LOCCTR += parseInt(t[2]);
      reserveflag = true;
    } else if (t[1] === "RESW") {
      LOCCTR += parseInt(t[2]) * 3;
      reserveflag = true;
    } else {
      console.log("Invalid Instruction / Invalid Directive")
    }
  }
}