import { BigInt } from "@graphprotocol/graph-ts"
import {
  GumballFactory,
  Initialized,
  OwnershipTransferred,
  ProxiesDeployed
} from "../generated/GumballFactory/GumballFactory"
import { GumballBondingCurve } from '../generated/templates';
import { GumballNft } from '../generated/templates';
import {Collection} from '../generated/schema'
import {
  GumballBondingCurve as BondingCurve,
  Buy as BuyEvent,
  Sell as SellEvent,
} from '../generated/templates/GumballBondingCurve/GumballBondingCurve';


export function handleInitialized(event: Initialized): void {}

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

  let collection = new Collection(event.params.tokenProxy.toHexString());
  collection.tokenLibrary = event.params.tokenLibrary;
  collection.gumballLibrary = event.params.gumballLibrary;
  collection.tokenProxy = event.params.tokenProxy;
  collection.gumballProxy = event.params.gumballProxy;
  collection.name = "";
  collection.price = BigInt.fromU32(0);
  collection.index = BigInt.fromI32(totalDeployed.toI32() - 1);
  // collection.index = totalDeployed;
  collection.save();
}
