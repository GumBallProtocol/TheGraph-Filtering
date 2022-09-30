import { BigInt, json, ipfs, log } from "@graphprotocol/graph-ts"
import {
  GumballFactory,
  Initialized,
  OwnershipTransferred,
  ProxiesDeployed
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

export function handleproxiesDeployed(event: ProxiesDeployed): void {
  let factory = GumballFactory.bind(event.address);
  let totalDeployed = factory.totalDeployed();
  GumballBondingCurve.create(event.params.tokenProxy);
  GumballNft.create(event.params.gumballProxy);
  // let contract = BondingCurve.bind(event.params.tokenProxy);
  // let currentPrice = contract.currentPrice();
  // let name = contract.name();
  // newTrade.name = name;
  // newTrade.currentPrice = currentPrice;
  
  let bondingCurve = BondingCurve.bind(event.params.tokenProxy);
  let nft = NFT.bind(event.params.gumballProxy);

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

  collection.image = "N/A";
  let baseURI = nft.baseTokenURI();

  let ipfsHash = "";
  if(baseURI){
      if (baseURI.includes("https://ipfs.io/ipfs/")) {
        ipfsHash = baseURI.split("//ipfs.io/ipfs/")[1];
        if(ipfsHash.includes("/"))
          ipfsHash = ipfsHash.split("/")[0];
      }
      if (baseURI.includes("ipfs://")) {
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
        if(image)
          collection.image = image.toString();
      }
    }
  }
  collection.save();
}
