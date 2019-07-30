import React from 'react';
import Input from '@material-ui/core/Input';
import * as babelParser from '@babel/parser';
import traverse from "babel-traverse";
import ComponentList from './ComponentList';

let fileReader;
let componentArray = [];
let importArray = {};
let impo = [];

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      components: [],
      imports: {}
    };
    this.MyVisitor = {
     JSXOpeningElement(path) {
       componentArray.push(path.node.name.name);
     },
     ImportDeclaration(path) {
       //console.log('import name---' +JSON.stringify(path.node.specifiers[0].local.name));
       var cmpName = path.node.specifiers[0].local.name;
       var cmpPath = path.node.source.value;
       importArray[cmpName] = cmpPath;
     }
   };
  }

  handleChange = (event) => {
    const fileChosen = event.target.files[0];
    if (this.validateFileType(fileChosen.type)) {
      componentArray = [];
      importArray = {};
      fileReader = new FileReader();
      fileReader.onloadend = this.parseFile;
      fileReader.readAsText(fileChosen);
    } else {
      alert("Please select a file of type JavaScript");
    }
  }

  validateFileType = (type) => {
    if (type === 'text/javascript')
      return true;
    return false;
  }

  parseFile = (e) => {
    const content = fileReader.result;
    const ast = babelParser.parse(content, {sourceType:'module', allowImportExportEverywhere:true, plugins:['jsx', 'classProperties']});
    traverse(ast, this.MyVisitor);
    let compSet = [...new Set(componentArray)];
    this.setState({components: compSet, imports: importArray});
  }

  render() {
    return (
      <div>
        Please select your index file: <br/>
        <Input
         id="file"
         type="file"
         onChange={this.handleChange}
         />
       <ComponentList componentList={this.state.components}/>
      </div>
    );
  }
}

export default App;
