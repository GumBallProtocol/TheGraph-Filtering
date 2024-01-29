// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Collection extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Collection entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Collection must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Collection", id.toString(), this);
    }
  }

  static loadInBlock(id: string): Collection | null {
    return changetype<Collection | null>(store.get_in_block("Collection", id));
  }

  static load(id: string): Collection | null {
    return changetype<Collection | null>(store.get("Collection", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get tokenLibrary(): Bytes {
    let value = this.get("tokenLibrary");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set tokenLibrary(value: Bytes) {
    this.set("tokenLibrary", Value.fromBytes(value));
  }

  get tokenProxy(): Bytes {
    let value = this.get("tokenProxy");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set tokenProxy(value: Bytes) {
    this.set("tokenProxy", Value.fromBytes(value));
  }

  get gumballProxy(): Bytes {
    let value = this.get("gumballProxy");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set gumballProxy(value: Bytes) {
    this.set("gumballProxy", Value.fromBytes(value));
  }

  get tokenDeployed(): Bytes {
    let value = this.get("tokenDeployed");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set tokenDeployed(value: Bytes) {
    this.set("tokenDeployed", Value.fromBytes(value));
  }

  get name(): string | null {
    let value = this.get("name");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set name(value: string | null) {
    if (!value) {
      this.unset("name");
    } else {
      this.set("name", Value.fromString(<string>value));
    }
  }

  get symbol(): string | null {
    let value = this.get("symbol");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set symbol(value: string | null) {
    if (!value) {
      this.unset("symbol");
    } else {
      this.set("symbol", Value.fromString(<string>value));
    }
  }

  get price(): BigInt {
    let value = this.get("price");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set price(value: BigInt) {
    this.set("price", Value.fromBigInt(value));
  }

  get index(): BigInt {
    let value = this.get("index");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set index(value: BigInt) {
    this.set("index", Value.fromBigInt(value));
  }

  get totalSupply(): BigInt {
    let value = this.get("totalSupply");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set totalSupply(value: BigInt) {
    this.set("totalSupply", Value.fromBigInt(value));
  }

  get supplyCap(): BigInt {
    let value = this.get("supplyCap");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set supplyCap(value: BigInt) {
    this.set("supplyCap", Value.fromBigInt(value));
  }

  get reserveGBT(): BigInt {
    let value = this.get("reserveGBT");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set reserveGBT(value: BigInt) {
    this.set("reserveGBT", Value.fromBigInt(value));
  }

  get gumbar(): Bytes {
    let value = this.get("gumbar");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set gumbar(value: Bytes) {
    this.set("gumbar", Value.fromBytes(value));
  }

  get factory(): Bytes {
    let value = this.get("factory");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set factory(value: Bytes) {
    this.set("factory", Value.fromBytes(value));
  }

  get address(): Bytes {
    let value = this.get("address");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set address(value: Bytes) {
    this.set("address", Value.fromBytes(value));
  }

  get whitelist(): boolean {
    let value = this.get("whitelist");
    if (!value || value.kind == ValueKind.NULL) {
      return false;
    } else {
      return value.toBoolean();
    }
  }

  set whitelist(value: boolean) {
    this.set("whitelist", Value.fromBoolean(value));
  }

  get baseURI(): string {
    let value = this.get("baseURI");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set baseURI(value: string) {
    this.set("baseURI", Value.fromString(value));
  }

  get volume(): BigDecimal {
    let value = this.get("volume");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigDecimal();
    }
  }

  set volume(value: BigDecimal) {
    this.set("volume", Value.fromBigDecimal(value));
  }

  get minted(): BigInt {
    let value = this.get("minted");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set minted(value: BigInt) {
    this.set("minted", Value.fromBigInt(value));
  }

  get artist(): Bytes {
    let value = this.get("artist");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set artist(value: Bytes) {
    this.set("artist", Value.fromBytes(value));
  }

  get rewards(): Array<string> | null {
    let value = this.get("rewards");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set rewards(value: Array<string> | null) {
    if (!value) {
      this.unset("rewards");
    } else {
      this.set("rewards", Value.fromStringArray(<Array<string>>value));
    }
  }

  get collectionMeta(): string | null {
    let value = this.get("collectionMeta");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set collectionMeta(value: string | null) {
    if (!value) {
      this.unset("collectionMeta");
    } else {
      this.set("collectionMeta", Value.fromString(<string>value));
    }
  }

  get ipfsHash(): string | null {
    let value = this.get("ipfsHash");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set ipfsHash(value: string | null) {
    if (!value) {
      this.unset("ipfsHash");
    } else {
      this.set("ipfsHash", Value.fromString(<string>value));
    }
  }
}

export class Trade extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Trade entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Trade must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Trade", id.toString(), this);
    }
  }

  static loadInBlock(id: string): Trade | null {
    return changetype<Trade | null>(store.get_in_block("Trade", id));
  }

  static load(id: string): Trade | null {
    return changetype<Trade | null>(store.get("Trade", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get amount(): BigInt {
    let value = this.get("amount");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set amount(value: BigInt) {
    this.set("amount", Value.fromBigInt(value));
  }

  get currentPrice(): BigInt {
    let value = this.get("currentPrice");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set currentPrice(value: BigInt) {
    this.set("currentPrice", Value.fromBigInt(value));
  }

  get timestamp(): BigInt | null {
    let value = this.get("timestamp");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set timestamp(value: BigInt | null) {
    if (!value) {
      this.unset("timestamp");
    } else {
      this.set("timestamp", Value.fromBigInt(<BigInt>value));
    }
  }

  get eventType(): string {
    let value = this.get("eventType");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set eventType(value: string) {
    this.set("eventType", Value.fromString(value));
  }

  get collection(): Bytes {
    let value = this.get("collection");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set collection(value: Bytes) {
    this.set("collection", Value.fromBytes(value));
  }

  get name(): string {
    let value = this.get("name");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set name(value: string) {
    this.set("name", Value.fromString(value));
  }

  get user(): Bytes {
    let value = this.get("user");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set user(value: Bytes) {
    this.set("user", Value.fromBytes(value));
  }
}

export class Swap extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Swap entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Swap must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Swap", id.toString(), this);
    }
  }

  static loadInBlock(id: string): Swap | null {
    return changetype<Swap | null>(store.get_in_block("Swap", id));
  }

  static load(id: string): Swap | null {
    return changetype<Swap | null>(store.get("Swap", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get sender(): Bytes {
    let value = this.get("sender");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set sender(value: Bytes) {
    this.set("sender", Value.fromBytes(value));
  }

  get amount(): BigInt {
    let value = this.get("amount");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set amount(value: BigInt) {
    this.set("amount", Value.fromBigInt(value));
  }

  get eventType(): string {
    let value = this.get("eventType");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set eventType(value: string) {
    this.set("eventType", Value.fromString(value));
  }

  get collection(): Bytes {
    let value = this.get("collection");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set collection(value: Bytes) {
    this.set("collection", Value.fromBytes(value));
  }
}

export class Token extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Token entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Token must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Token", id.toString(), this);
    }
  }

  static loadInBlock(id: string): Token | null {
    return changetype<Token | null>(store.get_in_block("Token", id));
  }

  static load(id: string): Token | null {
    return changetype<Token | null>(store.get("Token", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get tokenId(): BigInt {
    let value = this.get("tokenId");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set tokenId(value: BigInt) {
    this.set("tokenId", Value.fromBigInt(value));
  }

  get tokenURI(): string {
    let value = this.get("tokenURI");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set tokenURI(value: string) {
    this.set("tokenURI", Value.fromString(value));
  }

  get collection(): Bytes {
    let value = this.get("collection");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set collection(value: Bytes) {
    this.set("collection", Value.fromBytes(value));
  }

  get imageURI(): string {
    let value = this.get("imageURI");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set imageURI(value: string) {
    this.set("imageURI", Value.fromString(value));
  }

  get name(): string {
    let value = this.get("name");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set name(value: string) {
    this.set("name", Value.fromString(value));
  }

  get available(): boolean {
    let value = this.get("available");
    if (!value || value.kind == ValueKind.NULL) {
      return false;
    } else {
      return value.toBoolean();
    }
  }

  set available(value: boolean) {
    this.set("available", Value.fromBoolean(value));
  }

  get owner(): Bytes {
    let value = this.get("owner");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set owner(value: Bytes) {
    this.set("owner", Value.fromBytes(value));
  }

  get attributes(): TokenAttributeLoader {
    return new TokenAttributeLoader(
      "Token",
      this.get("id")!.toString(),
      "attributes"
    );
  }

  get baseURI(): string | null {
    let value = this.get("baseURI");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set baseURI(value: string | null) {
    if (!value) {
      this.unset("baseURI");
    } else {
      this.set("baseURI", Value.fromString(<string>value));
    }
  }

  get staked(): boolean {
    let value = this.get("staked");
    if (!value || value.kind == ValueKind.NULL) {
      return false;
    } else {
      return value.toBoolean();
    }
  }

  set staked(value: boolean) {
    this.set("staked", Value.fromBoolean(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }
}

export class Interval extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Interval entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Interval must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Interval", id.toString(), this);
    }
  }

  static loadInBlock(id: string): Interval | null {
    return changetype<Interval | null>(store.get_in_block("Interval", id));
  }

  static load(id: string): Interval | null {
    return changetype<Interval | null>(store.get("Interval", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get time_frame(): string {
    let value = this.get("time_frame");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set time_frame(value: string) {
    this.set("time_frame", Value.fromString(value));
  }

  get timestamp(): string {
    let value = this.get("timestamp");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set timestamp(value: string) {
    this.set("timestamp", Value.fromString(value));
  }

  get collection(): Bytes {
    let value = this.get("collection");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set collection(value: Bytes) {
    this.set("collection", Value.fromBytes(value));
  }

  get trade_count(): BigInt {
    let value = this.get("trade_count");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set trade_count(value: BigInt) {
    this.set("trade_count", Value.fromBigInt(value));
  }

  get price_sum(): BigInt {
    let value = this.get("price_sum");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set price_sum(value: BigInt) {
    this.set("price_sum", Value.fromBigInt(value));
  }

  get average_price(): BigInt {
    let value = this.get("average_price");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set average_price(value: BigInt) {
    this.set("average_price", Value.fromBigInt(value));
  }

  get buy_events(): BigInt {
    let value = this.get("buy_events");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set buy_events(value: BigInt) {
    this.set("buy_events", Value.fromBigInt(value));
  }

  get sell_events(): BigInt {
    let value = this.get("sell_events");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set sell_events(value: BigInt) {
    this.set("sell_events", Value.fromBigInt(value));
  }
}

export class Reward extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Reward entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Reward must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Reward", id.toString(), this);
    }
  }

  static loadInBlock(id: string): Reward | null {
    return changetype<Reward | null>(store.get_in_block("Reward", id));
  }

  static load(id: string): Reward | null {
    return changetype<Reward | null>(store.get("Reward", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get total(): BigInt {
    let value = this.get("total");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set total(value: BigInt) {
    this.set("total", Value.fromBigInt(value));
  }

  get tokenAddress(): Bytes {
    let value = this.get("tokenAddress");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set tokenAddress(value: Bytes) {
    this.set("tokenAddress", Value.fromBytes(value));
  }
}

export class CollectionMeta extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save CollectionMeta entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type CollectionMeta must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("CollectionMeta", id.toString(), this);
    }
  }

  static loadInBlock(id: string): CollectionMeta | null {
    return changetype<CollectionMeta | null>(
      store.get_in_block("CollectionMeta", id)
    );
  }

  static load(id: string): CollectionMeta | null {
    return changetype<CollectionMeta | null>(store.get("CollectionMeta", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get collection(): string {
    let value = this.get("collection");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set collection(value: string) {
    this.set("collection", Value.fromString(value));
  }

  get image(): string | null {
    let value = this.get("image");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set image(value: string | null) {
    if (!value) {
      this.unset("image");
    } else {
      this.set("image", Value.fromString(<string>value));
    }
  }

  get name(): string | null {
    let value = this.get("name");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set name(value: string | null) {
    if (!value) {
      this.unset("name");
    } else {
      this.set("name", Value.fromString(<string>value));
    }
  }

  get description(): string | null {
    let value = this.get("description");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set description(value: string | null) {
    if (!value) {
      this.unset("description");
    } else {
      this.set("description", Value.fromString(<string>value));
    }
  }

  get content(): string | null {
    let value = this.get("content");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set content(value: string | null) {
    if (!value) {
      this.unset("content");
    } else {
      this.set("content", Value.fromString(<string>value));
    }
  }
}

export class TokenAttribute extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save TokenAttribute entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type TokenAttribute must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("TokenAttribute", id.toString(), this);
    }
  }

  static loadInBlock(id: string): TokenAttribute | null {
    return changetype<TokenAttribute | null>(
      store.get_in_block("TokenAttribute", id)
    );
  }

  static load(id: string): TokenAttribute | null {
    return changetype<TokenAttribute | null>(store.get("TokenAttribute", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get token(): string {
    let value = this.get("token");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set token(value: string) {
    this.set("token", Value.fromString(value));
  }

  get attribute(): string | null {
    let value = this.get("attribute");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set attribute(value: string | null) {
    if (!value) {
      this.unset("attribute");
    } else {
      this.set("attribute", Value.fromString(<string>value));
    }
  }

  get value(): string | null {
    let value = this.get("value");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set value(value: string | null) {
    if (!value) {
      this.unset("value");
    } else {
      this.set("value", Value.fromString(<string>value));
    }
  }
}

export class TokenAttributeLoader extends Entity {
  _entity: string;
  _field: string;
  _id: string;

  constructor(entity: string, id: string, field: string) {
    super();
    this._entity = entity;
    this._id = id;
    this._field = field;
  }

  load(): TokenAttribute[] {
    let value = store.loadRelated(this._entity, this._id, this._field);
    return changetype<TokenAttribute[]>(value);
  }
}
