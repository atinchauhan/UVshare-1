import React, { Component } from "react";
import SimpleStorageContract from "../contracts/SimpleStorage.json";
import getWeb3 from "../utils/getWeb3";
import ipfs from './ipfs';

const abiDecoder = require('abi-decoder');
// hash array to store hashes of videos
var hash=[];
const testABI=[
  {
    "constant": true,
    "inputs": [],
    "name": "ipfsHash",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "x",
        "type": "string"
      }
    ],
    "name": "set",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "get",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];
abiDecoder.addABI(testABI);

export class Upload extends Component{
  state = { ipfsHash:' ',web3: null, accounts: null, contract: null ,buffer:null,transactionHash:''};


  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      // var currentBlock = web3.eth.blockNumber;
      //   console.log("block "+currentBlock);
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address
      );
      
        this.simpleStorageInstance=instance;

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
        this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    
    /////////////////////////////////////////////////////////////////////////////////////////////
    // this is to put hashes of the videos in the hash array
    var num=0;
       
        //var currentBlock = web3.eth.blockNumber;
       await web3.eth.getBlockNumber(function(error, result){ 
          if (!error)
            console.log("block number => "+result);
            num=result;
     
            
        });
 
        
  var j=0;
        for(var i=num-2;i<=num;i++){

         // let children=[];
          var block =await web3.eth.getBlock(i, true);
          if (block != null && block.transactions != null){
            block.transactions.forEach( function(e) {
                const testData=e.input;
                // console.log(testData);
                const decodedData=abiDecoder.decodeMethod(testData);
                 console.log(decodedData);
                 if(decodedData!=null){
                  console.log(decodedData.params[0].value);
                 // children.push(<td>{`Column ${decodedData.params[0].value}`}</td>);
                  hash[j]=decodedData.params[0].value;
                  j++;
                 }
                // console.log(decodedData.params[0].value);

              // if (myaccount == "*" || myaccount == e.from || myaccount == e.to) {
                console.log("  tx hash          : " + e.hash + "\n"
                  + "   nonce           : " + e.nonce + "\n"
                  + "   blockHash       : " + e.blockHash + "\n"
                  + "   blockNumber     : " + e.blockNumber + "\n"
                  + "   transactionIndex: " + e.transactionIndex + "\n"
                  + "   from            : " + e.from + "\n" 
                  + "   to              : " + e.to + "\n"
                  + "   value           : " + e.value + "\n"
                  + "   time            : " + block.timestamp + " " + new Date(block.timestamp * 1000).toGMTString() + "\n"
                  + "   gasPrice        : " + e.gasPrice + "\n"
                  + "   gas             : " + e.gas + "\n"
                  + "   input           : " + e.input+"\n"
                  + "   ipfs            : " + e.methods);
              // }
            })
          } 
          else{
            console.log("null");
          }
        }
        console.log('hash '+ hash);
        this.setState({ web3:web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

 


  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
   // await contract.methods.set('5').send({ from: accounts[0] });
   this.simpleStorageInstance.options.address = "0x4a8Ae5A86B9A91683adeFf6a1e37cDAe2bD3FbC0";
    //await this.simpleStorageInstance.methods.set("fbsfgke").send({from:this.state.accounts[0]});
    // Get the value from the contract to prove it worked.
    const response= await this.simpleStorageInstance.methods.get().call();
    //const response = await contract.methods.get().call();
    console.log("hey "+response);
    // Update state with the result.
    this.setState({ ipfsHash: response });
  };
   

    captureFile=(event)=>{
    
    event.preventDefault();
    const file=event.target.files[0]
    const reader=new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend=()=>{
      this.setState({buffer: Buffer(reader.result)})
      console.log('buffer',this.state.buffer)
    }

  }


 onSubmit=async(event)=> {

//const { accounts, contract } = this.state;

    event.preventDefault();
    var hash="";
    //const { accounts, contract } = this.state;
    await ipfs.files.add(this.state.buffer, (error, result) => {
      if(error) {
        console.error(error)
        return
      }
        hash=hash+result[0].hash;
        console.log(hash);
        // this.state.contract.methods.set(result[0].hash);
        //this.setState({ipfsHash:result[0].hash });
        this.simpleStorageInstance.options.address = "0x4a8Ae5A86B9A91683adeFf6a1e37cDAe2bD3FbC0";
        this.simpleStorageInstance.methods.set(result[0].hash).send({from:this.state.accounts[0]});
       // await this.simpleStorageInstance.methods.set(result[0].hash).send({from:this.state.accounts[0]});
        
        this.setState({ipfsHash:result[0].hash });
          // this.setState({ipfsHash:this.hash });
        console.log('ifpsHash', this.state.ipfsHash);
      
    })

   
    
  }

 
 

  render() {
    //var names = ['Jake', 'Jon', 'Thruster'];
       var par=[];
       
        var hashList = hash.map(function(name){
                        return <li><img src={`https://ipfs.io/ipfs/${name}`} alt=""/></li>;
                      })
    
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    
    return (
      <div className="App">
        <div>The stored value is: {this.state.buffer}</div>
           
                    {/* <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt=""/> */}
      
        <h2>upload image</h2>
        <div>{hashList}
          
          </div>
        <form onSubmit={this.onSubmit}>
         <input type ='file'  onChange={this.captureFile}/>
         <input type ='submit' />
        </form>
         
         
      </div>
    );
  }
  }

  export default Upload;
  
  

