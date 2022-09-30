import { Address, BigInt } from '@graphprotocol/graph-ts';
import {
  GumballFactory
} from "../generated/GumballFactory/GumballFactory"
import {
  GumballBondingCurve,
  Buy as BuyEvent,
  Sell as SellEvent,
} from '../generated/templates/GumballBondingCurve/GumballBondingCurve';
import { Trade, Collection } from '../generated/schema';

export function handleBuy(event: BuyEvent): void {
  let newTrade = new Trade(event.transaction.hash.toHexString());
  newTrade.amount = event.params.amount;
  let contract = GumballBondingCurve.bind(event.address);
  let currentPrice = contract.currentPrice();
  let name = contract.name();
  newTrade.name = name;
  newTrade.currentPrice = currentPrice;
  newTrade.eventType = 'buy';
  newTrade.collection = event.address;
  newTrade.timestamp = event.block.timestamp;
  newTrade.save();

  let collection = Collection.load(event.address.toHexString());
  if (collection) {
    let factory = GumballFactory.bind(Address.fromBytes(collection.factory));
    collection.name = name;
    collection.price = currentPrice;
    collection.totalSupply = factory.totalDeployed();
    collection.reserveGBT = contract.reserveGBT();
    collection.supplyCap = contract.totalSupply();
    collection.save();
  }
}

export function handleSell(event: SellEvent): void {
  let newTrade = new Trade(event.transaction.hash.toHexString());
  newTrade.amount = event.params.amount;
  let contract = GumballBondingCurve.bind(event.address);
  let currentPrice = contract.currentPrice();
  let name = contract.name();
  newTrade.name = name;
  newTrade.currentPrice = currentPrice;
  newTrade.timestamp = event.block.timestamp;
  newTrade.eventType = 'sell';
  newTrade.collection = event.address;
  newTrade.save();

  //load collection
  let collection = Collection.load(event.address.toHexString());
  if (collection) {
    let factory = GumballFactory.bind(Address.fromBytes(collection.factory));
    collection.name = name;
    collection.price = currentPrice;
    collection.totalSupply = factory.totalDeployed();
    collection.reserveGBT = contract.reserveGBT();
    collection.supplyCap = contract.totalSupply();
    collection.save();
  }
}
