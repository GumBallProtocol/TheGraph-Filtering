import * as path from 'path';
import * as fsExtra from 'fs-extra';


export enum SUPPORTED {
  ARBITRUM = 'arbitrum-one',
  MAINNET = 'mainnet',
  LLAMA = 'llama',
}

const CONSTANTS_FILE_NAME = 'constants.ts';
const TEMPLATE_FILE_NAME = 'subgraph.template.yaml'

//!!!TODO: also copy silo protocol file (with chain specific values and updated protocol values)
async function main() {
  try {
    const network = process.argv[2];
    
    if (!network){
      console.error('no network parameter passed, pass either: ', SUPPORTED.ARBITRUM, SUPPORTED.MAINNET);
      process.exit(-1);
    }

    if (network !== SUPPORTED.ARBITRUM && network !== SUPPORTED.MAINNET && network !== SUPPORTED.LLAMA){
      console.error('invalid newtork parameter passed, pass either: ', SUPPORTED.ARBITRUM, SUPPORTED.MAINNET);
      process.exit(-1);
    }

    const cwd = process.cwd();
    console.log('cwd:', cwd);

    console.log('preparing config for network:', network);
    const constantsFilePath = path.join(__dirname + '/../config/' + network + '/' + CONSTANTS_FILE_NAME);
    const templateFilePath = path.join(__dirname + '/../config/' + network + '/' + TEMPLATE_FILE_NAME);
    const constantsOutputPath = path.join(__dirname + '/../src/utils/' + CONSTANTS_FILE_NAME);
    const templateFileOutputPath = path.join(__dirname + '/../' + TEMPLATE_FILE_NAME);

    console.log('constants path:', constantsFilePath, ' to:', constantsOutputPath);
    console.log('template path:', templateFilePath, ' to:', templateFileOutputPath);

    fsExtra.copySync(constantsFilePath, constantsOutputPath);
    fsExtra.copySync(templateFilePath, templateFileOutputPath);
  }catch (error){
    console.error(error);
  }
}

main();