import { BigInt, json, ipfs, log } from "@graphprotocol/graph-ts"
import {
  GumballFactory,
  Initialized,
  OwnershipTransferred,
  ProxiesDeployed,
  WhitelistExisting
} from "../generated/GumballFactory/GumballFactory"
import { GumballBondingCurve } from '../generated/templates';
import { GumballNft } from '../generated/templates';
import {Collection, Token} from '../generated/schema'
import {
  GumballBondingCurve as BondingCurve,
  Buy as BuyEvent,
  Sell as SellEvent,
} from '../generated/templates/GumballBondingCurve/GumballBondingCurve';
import { GumballNft as NFT } from "../generated/templates/GumballNft/GumballNft";


export function handleOwnershipTransferred(event: OwnershipTransferred): void {}


export function handleWhitelistExisting(event: WhitelistExisting): void {
  let factory = GumballFactory.bind(event.address);
  let deployInfo = factory.deployInfo(event.params.index);
  
  let col = Collection.load(deployInfo.value0.toHexString());
  if(col) {
    col.whitelist = event.params._bool;
    col.save();
  }
}
// export function handleWhitelistExisting(call: WhitelistExistingCall): void {
//   let factory = GumballFactory.bind(call.to);
//   let index = call.inputs._index;

//   let deployInfo = factory.deployInfo(index);
  
//   let col = Collection.load(deployInfo.value0.toHexString());
//   if(col) {
//     col.whitelist = call.inputs._bool;
//     col.save();
//   }
// }

export function handleproxiesDeployed(event: ProxiesDeployed): void {
  let factory = GumballFactory.bind(event.address);
  
  GumballBondingCurve.create(event.params.tokenProxy);
  GumballNft.create(event.params.gumballProxy);
  // let contract = BondingCurve.bind(event.params.tokenProxy);
  // let currentPrice = contract.currentPrice();
  // let name = contract.name();
  // newTrade.name = name;
  // newTrade.currentPrice = currentPrice;
  
  let bondingCurve = BondingCurve.bind(event.params.tokenProxy);
  let nft = NFT.bind(event.params.gumballProxy);
  let totalDeployed = factory.totalDeployed();
  log.error('INDEX = {}', [BigInt.fromI32(totalDeployed.toI32() - 1).toString()]);

  let deployInfo = factory.deployInfo(
    BigInt.fromI32(totalDeployed.toI32() - 1)
  );

  let collection = new Collection(event.params.tokenProxy.toHexString());
  collection.tokenLibrary = event.params.tokenLibrary;
  collection.gumballLibrary = event.params.gumballLibrary;
  collection.tokenProxy = event.params.tokenProxy;
  collection.gumballProxy = event.params.gumballProxy;
  collection.gumbar = event.params.gumbar;
  collection.totalSupply = totalDeployed;
  collection.price = BigInt.fromU32(0);
  collection.index = BigInt.fromI32(totalDeployed.toI32() - 1);
  collection.tokenDeployed = event.params.tokenProxy;
  collection.factory = event.address;
  collection.address = event.params.gumballProxy;
  
  collection.reserveGBT = bondingCurve.reserveGBT();
  collection.supplyCap = bondingCurve.totalSupply();
  collection.name = bondingCurve.name();
  collection.symbol = bondingCurve.symbol();
  collection.whitelist = deployInfo.value2;
  collection.description = "";
  log.error("DEPLOY INFO {} , {} , {}", [deployInfo.value0.toHexString(), deployInfo.value1.toHexString(), deployInfo.value2 ? 'true' : 'false']);
  // collection.whitelist = true;

  collection.image = "N/A";
  let baseURI = nft.baseTokenURI();
  collection.baseURI = baseURI;
  let ipfsHash = "";
  if(baseURI){
      if(baseURI.includes("mypinata.cloud/ipfs/")){
        ipfsHash = baseURI.split("mypinata.cloud/ipfs/")[1];
        if(ipfsHash.includes("/"))
          ipfsHash = ipfsHash.split("/")[0];
      }
      else if (baseURI.includes("https://ipfs.io/ipfs/")) {
        ipfsHash = baseURI.split("//ipfs.io/ipfs/")[1];
        if(ipfsHash.includes("/"))
          ipfsHash = ipfsHash.split("/")[0];
      }
      else if (baseURI.includes("ipfs://")) {
        ipfsHash = baseURI.split("pfs://")[1];
        if(ipfsHash.includes("/"))
          ipfsHash = ipfsHash.split("/")[0];
      }
    ipfsHash = ipfsHash +"/1"
    let metadata = ipfs.cat(ipfsHash);
    if(metadata){
      const value = json.fromBytes(metadata).toObject()
      if (value){
        const image = value.get('image')
        const description = value.get('description')
        if(image){
          // if(image.toString().includes("https"))
          //   collection.image = image.toString();
          // else
          //   collection.image = baseURI.toString() + image.toString();
          let temp_image = image.toString()
          temp_image = temp_image.replace("ipfs.io", "peach-junior-gibbon-393.mypinata.cloud")
          collection.image = temp_image
        }
          if(description)
            collection.description = description.toString();
      }
    }
  }
  collection.save();
}
