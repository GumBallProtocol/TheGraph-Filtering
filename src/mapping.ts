import { BigInt, json, ipfs, log, BigDecimal, JSONValueKind } from "@graphprotocol/graph-ts"
import {
  GumballFactory,
  OwnershipTransferred,
  GumBallDeployed,
  AllowExisting
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


export function handleAllowExisting(event: AllowExisting): void {
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

export function handleGumBallDeployed(event: GumBallDeployed): void {
  let factory = GumballFactory.bind(event.address);
  
  GumballBondingCurve.create(event.params.gbt);
  GumballNft.create(event.params.gnft);

  let bondingCurve = BondingCurve.bind(event.params.gbt);
  let nft = NFT.bind(event.params.gnft);
  
  let totalDeployed = factory.totalDeployed();
  log.error('INDEX = {}', [BigInt.fromI32(totalDeployed.toI32() - 1).toString()]);

  let deployInfo = factory.deployInfo(
    BigInt.fromI32(totalDeployed.toI32() - 1)
  );
  
  let collection = new Collection(event.params.gbt.toHexString());
  collection.artist = bondingCurve.artist();
  collection.tokenLibrary = event.params.gbt;
  collection.minted = BigInt.fromString("0");
  collection.tokenProxy = event.params.gbt;
  collection.gumballProxy = event.params.gnft;
  collection.gumbar = event.params.xgbt;
  collection.totalSupply = totalDeployed;
  collection.price = BigInt.fromU32(0);
  collection.index = BigInt.fromI32(totalDeployed.toI32() - 1);
  collection.tokenDeployed = event.params.gbt;
  collection.factory = event.address;
  collection.address = event.params.gnft;
  collection.volume = BigDecimal.fromString("0");
  collection.reserveGBT = bondingCurve.reserveGBT();
  collection.supplyCap = bondingCurve.totalSupply();
  collection.name = bondingCurve.name();
  collection.symbol = bondingCurve.symbol();
  collection.whitelist = deployInfo.value3;
  collection.description = "";
  collection.rewards = BigInt.fromString("0");
  log.error("DEPLOY INFO {} , {} , {}", [deployInfo.value0.toHexString(), deployInfo.value1.toHexString(), deployInfo.value3 ? 'true' : 'false']);

  collection.image = "N/A";
  let baseURI = nft.baseTokenURI();
  collection.baseURI = nft.baseTokenURI();
  // let baseURI = nft.contractURI();
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
      else if(baseURI.includes(".ipfs")){
        ipfsHash = baseURI.split("ttps://")[1];
        let longest = ipfsHash.split('.');
        ipfsHash = longest[0];
      }
      if (ipfsHash.includes("/"))
        ipfsHash = ipfsHash.split("/")[0];
    ipfsHash = ipfsHash +"/1"
    let metadata = ipfs.cat(ipfsHash);
    if(!metadata){
      metadata = ipfs.cat(ipfsHash)
    }
    if(metadata){
      const value = json.fromBytes(metadata).toObject()
      if (value){
        const image = value.get('image')
        const description = value.get('description')
        if(image && image.kind === JSONValueKind.STRING){
          collection.image = image.toString()
        }
          if(description && description.kind === JSONValueKind.STRING)
            collection.description = description.toString();
      }
    }
  }
  collection.save();
}
