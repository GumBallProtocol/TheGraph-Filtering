import { Address, BigInt, log } from '@graphprotocol/graph-ts';
import {
  GumballFactory
} from "../generated/GumballFactory/GumballFactory"
import {
  GumballBondingCurve,
  Buy as BuyEvent,
  Sell as SellEvent,
} from '../generated/templates/GumballBondingCurve/GumballBondingCurve';
import { Trade, Collection, Interval } from '../generated/schema';
import { convertTokenToDecimal } from './helpers';

export function handleBuy(event: BuyEvent): void {
  log.warning("BUY EVENT: {}", [event.params.amount.toString()])
  let newTrade = new Trade(event.transaction.hash.toHexString());
  newTrade.amount = event.params.amount;
  let contract = GumballBondingCurve.bind(event.address);
  let currentPrice = contract.currentPrice();
  let name = contract.name();
  newTrade.name = name;
  newTrade.user = event.params.user;
  newTrade.currentPrice = currentPrice;
  newTrade.eventType = 'buy';
  newTrade.collection = event.address;
  newTrade.timestamp = event.block.timestamp;
  newTrade.save();

  let collection = Collection.load(event.address.toHexString());
  if (collection) {
    let factory = GumballFactory.bind(Address.fromBytes(collection.factory));

    let vol = convertTokenToDecimal(event.params.amount);
    // log.error("CONVERTED VOLUME BUY: {}", [vol.toString()])

    collection.volume = collection.volume.plus(vol)

    collection.name = name;
    collection.price = currentPrice;
    collection.totalSupply = factory.totalDeployed();
    collection.reserveGBT = contract.reserveGBT();
    collection.supplyCap = contract.totalSupply();
    collection.save();
  }
  let five_min = BigInt.fromString('300')
  let fifteen_min = BigInt.fromString('900')
  let one_hour = BigInt.fromString('3600')
  let one_day = BigInt.fromString('86400')
  let vars = [five_min, fifteen_min, one_hour, one_day]
  for (let i = 0; i < vars.length; i++) {
    let interval_id = event.block.timestamp.minus(event.block.timestamp.mod(vars[i]))
    let interval = Interval.load(event.address.toHexString() + "_" + interval_id.toString() + "_" + vars[i].toString())
    if (interval) {
      interval.trade_count = interval.trade_count.plus(BigInt.fromString("1"))
      interval.price_sum = interval.price_sum.plus(currentPrice)
      interval.average_price = interval.price_sum.div(interval.trade_count)
      interval.buy_events = interval.buy_events.plus(BigInt.fromString("1"))
    } else {
      interval = new Interval(event.address.toHexString() + "_" + interval_id.toString() + "_" + vars[i].toString())
      interval.time_frame = vars[i].toString()
      interval.collection = event.address
      interval.trade_count = BigInt.fromString("1")
      interval.price_sum = currentPrice
      interval.average_price = currentPrice
      interval.buy_events = BigInt.fromString("1")
      interval.sell_events = BigInt.fromString("0")
      interval.timestamp = interval_id.toString()
    }
    interval.save()
  }
}

export function handleSell(event: SellEvent): void {
  let newTrade = new Trade(event.transaction.hash.toHexString());
  newTrade.amount = event.params.amount;
  let contract = GumballBondingCurve.bind(event.address);
  let currentPrice = contract.currentPrice();
  let name = contract.name();
  newTrade.name = name;
  newTrade.user = event.params.user;
  newTrade.currentPrice = currentPrice;
  newTrade.timestamp = event.block.timestamp;
  newTrade.eventType = 'sell';
  newTrade.collection = event.address;
  newTrade.save();

  //load collection
  let collection = Collection.load(event.address.toHexString());
  if (collection) {
    let factory = GumballFactory.bind(Address.fromBytes(collection.factory));
    let cp = convertTokenToDecimal(currentPrice);
    let am = convertTokenToDecimal(event.params.amount);
    let vol = cp.times(am);
    // log.error("CONVERTED VOLUME SELL: {}", [vol.toString()])

    collection.volume = collection.volume.plus(vol);

    collection.name = name;
    collection.price = currentPrice;
    collection.totalSupply = factory.totalDeployed();
    collection.reserveGBT = contract.reserveGBT();
    collection.supplyCap = contract.totalSupply();
    collection.save();
  }

  let five_min = BigInt.fromString('300')
  let fifteen_min = BigInt.fromString('900')
  let one_hour = BigInt.fromString('3600')
  let one_day = BigInt.fromString('86400')
  let vars = [five_min, fifteen_min, one_hour, one_day]
  for (let i = 0; i < vars.length; i++) {
    let interval_id = event.block.timestamp.minus(event.block.timestamp.mod(vars[i]))
    let interval = Interval.load(event.address.toHexString() + "_" + interval_id.toString() + "_" + vars[i].toString())
    if (interval) {
      interval.trade_count = interval.trade_count.plus(BigInt.fromString("1"))
      interval.price_sum = interval.price_sum.plus(currentPrice)
      interval.average_price = interval.price_sum.div(interval.trade_count)
      interval.sell_events = interval.buy_events.plus(BigInt.fromString("1"))
    } else {
      interval = new Interval(event.address.toHexString() + "_" + interval_id.toString() + "_" + vars[i].toString())
      interval.time_frame = vars[i].toString()
      interval.collection = event.address
      interval.trade_count = BigInt.fromString("1")
      interval.price_sum = currentPrice
      interval.average_price = currentPrice
      interval.buy_events = BigInt.fromString("0")
      interval.sell_events = BigInt.fromString("1")
      interval.timestamp = interval_id.toString()
    }
    interval.save()
  }
}
