
var file = [];
export function writeHeader(file, name, starting, proglen) {
  let header = "H" + programname(name);
  header += hexstrToWord(starting.toString(16));
  header += hexstrToWord(proglen.toString(16));
  header += "\n";
  file.push(header);
}

export function programname(name) {
  let n = 6 - name.length;
  for (let i = 0; i < n; i++) {
    name = name + ' ';
  }
  return name;
}

export function writeText(file, starting, tline) {
  let textrecord = "T" + hexstrToWord(starting.toString(16));
  let l = (tline.length / 2).toString(16);
  l = l.padStart(2, '0');
  l = l.toUpperCase();
  textrecord += l;
  textrecord += tline;
  textrecord += "\n";
  file.push(textrecord);
  
}

export function writeEnd(file, address) {
  let endrecord = "E" + hexstrToWord(address.toString(16));
  file.push(endrecord);
  console.log(file) 
  return file
}

export function hexstrToWord(hexstr) {
  const hex = '0x';
  hexstr = hex+hexstr;
  hexstr = hexstr.toUpperCase();
  hexstr = hexstr.substring(2);
  let n = 6 - hexstr.length;
  for (let i = 0; i < n; i++) {
    hexstr = '0' + hexstr;
  }
  return hexstr;
}