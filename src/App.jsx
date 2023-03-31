import './App.css'
import React, { useState } from 'react';
import {Pass1} from './Pass1.jsx';
import {Pass2} from './Pass2.jsx';
export default function App() {

  const [content, setContent] = useState('');
  const [proglen, setProglen] = useState('');
  const handleFileRead = (e) => {
    const content = e.target.result;
    setContent(content);
    document.getElementById("output3").value = content
    console.log('file content',  content)
  };
  const handleFileChosen = (file) => {
    const fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file);
  };
  function writeoutput1(){
    var result_pass1 = Pass1(content);
    console.log(result_pass1.SYMTAB)
    setProglen(result_pass1.proglen)
    document.getElementById("output1").value = JSON.stringify(result_pass1.SYMTAB)
  }
  function writeoutput2(){
    const SYMTAB = document.getElementById("output1").value
    document.getElementById("output2").value = JSON.stringify(Pass2(content,SYMTAB,proglen))
  }
  return (
    <div>
      <div class = "flex-container">
        <div class = "flex-column">
          <input 
            id="input" type="file" accept=".asm" 
            onChange={(e) => handleFileChosen(e.target.files[0])}>
          </input>
          <button class = "button" onClick={writeoutput1}
            >PASS1</button>
          <button class = "button" onClick={writeoutput2}
            >PASS2</button>
          <input id="output3" type="text" disabled={true} class ="output3" ></input>
        </div>

        <input id="output1" type="text" disabled={true} class = "textbox"></input>
        <input id="output2" type="text" disabled={true} class = "textbox"></input>
      </div>

    </div>
  )
}
