import React from 'react';
import Input from '@material-ui/core/Input';
import * as babelParser from '@babel/parser';
import traverse from "babel-traverse";
import ComponentList from './ComponentList';

let fileReader;
let componentArray = [];
const MyVisitor = {
  JSXOpeningElement(path) {
    componentArray.push(path.node.name.name);
  }
};
class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      components: []
    };
  }

  handleChange = (event) => {
    const fileChosen = event.target.files[0];
    if (this.validateFileType(fileChosen.type)) {
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
    traverse(ast, MyVisitor);
    //let listOfAllComponents = [...new Set(componentArray)];
    this.setState({components: [...new Set(componentArray)]});
    /*traverse(ast, {
      enter(path) {
        if (path.node.type === "ReturnStatement" &&
            path.node.argument.type === "JSXElement") {
            console.log(path.node.type);
            console.log(path.node.argument.children);
        }
      }
    });*/
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
