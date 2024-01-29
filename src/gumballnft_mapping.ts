import {
  Address,
  BigInt,
  ipfs,
  json,
  JSONValueKind,
  log,
  store,
} from "@graphprotocol/graph-ts";
import {
  GumballNft,
  Approval,
  ApprovalForAll,
  ExactSwap as ExactSwapEvent,
  Redeem,
  Swap as SwapEvent,
  Transfer,
  SetBaseURI,
} from "../generated/templates/GumballNft/GumballNft";
import { Swap, Token, Collection, CollectionMeta } from "../generated/schema";
import {
  createIPFSMetadata,
  handleCollectionMetadata,
  createTokenMetadata,
} from "./nft_metadata";

export function handleExactSwap(event: ExactSwapEvent): void {
  let swap = new Swap(event.block.hash.toHexString());
  swap.sender = event.params.user;
  swap.amount = BigInt.fromU32(event.params.id.length);
  swap.collection = event.address;
  swap.eventType = "exact_swap";
  swap.save();
}

export function handleRedeem(event: Redeem): void {
  let swap = new Swap(event.block.hash.toHexString());
  swap.sender = event.params.user;
  swap.amount = BigInt.fromU32(1);
  swap.collection = event.address;
  swap.eventType = "redeem";
  swap.save();
}

export function handleSwap(event: SwapEvent): void {
  let swap = new Swap(event.block.hash.toHexString());
  swap.sender = event.params.user;
  swap.amount = event.params.amount;
  swap.collection = event.address;
  swap.eventType = "swap";
  swap.save();
}

export function handleSetBaseURI(event: SetBaseURI): void {
  log.error("Handle set Base URI: {}", [event.address.toHexString()]);
  let contract = GumballNft.bind(event.address);
  let collection_id = contract.GBT();
  let collection = Collection.load(collection_id.toHexString());
  let baseURI = event.params.uri;
  baseURI = baseURI.trim();
  let ipfsHash = "";
  if (baseURI && collection) {
    collection.baseURI = baseURI;
    if (baseURI.includes("mypinata.cloud/ipfs/")) {
      ipfsHash = baseURI.split("mypinata.cloud/ipfs/")[1];
    } else if (baseURI.includes("https://ipfs.io/ipfs/")) {
      ipfsHash = baseURI.split("//ipfs.io/ipfs/")[1];
    } else if (baseURI.includes("ipfs://")) {
      ipfsHash = baseURI.split("pfs://")[1];
    } else if (baseURI.includes(".ipfs")) {
      ipfsHash = baseURI.split("https://")[1];
      let longest = ipfsHash.split(".");
      ipfsHash = longest[0];
    }
    if (ipfsHash.includes("/")) ipfsHash = ipfsHash.split("/")[0];
    ipfsHash = ipfsHash + "/1";

    createIPFSMetadata(ipfsHash, collection.id);
    collection.collectionMeta = collection.id + "-" + ipfsHash; // update value
    collection.ipfsHash = ipfsHash;

    collection.save();

    let total = collection.minted.toString();
    let x = parseInt(total);
    x = trunc(x);
    for (let i = 0; i < x; i++) {
      let token = Token.load(
        event.address.toHexString() + BigInt.fromString(`${i}`).toString()
      );
      if (token) {
        baseURI = contract.tokenURI(BigInt.fromString(`${i}`));
        let ipfsHash2 = "";
        if (baseURI.includes("mypinata.cloud/ipfs/")) {
          ipfsHash2 = baseURI.split("mypinata.cloud/ipfs/")[1];
        } else if (baseURI.includes("https://ipfs.io/ipfs/")) {
          ipfsHash2 = baseURI.split("//ipfs.io/ipfs/")[1];
        } else if (baseURI.includes("ipfs://")) {
          ipfsHash2 = baseURI.split("pfs://")[1];
        } else if (baseURI.includes(".ipfs")) {
          ipfsHash2 = baseURI.split("https://")[1];
          let longest = ipfsHash2.split(".");
          ipfsHash2 = longest[0];
        }
        if (ipfsHash2.includes("/")) ipfsHash2 = ipfsHash2.split("/")[0];
        ipfsHash2 = ipfsHash2 + "/" + i.toString();

        createTokenMetadata(ipfsHash2, token.id);
        token.baseURI = baseURI;
        token.save();
      } else {
        log.error("TOKEN NOT FOUND: {}", [
          event.address.toHexString() + i.toString(),
        ]);
      }
    }
  }
}

export function handleTransfer(event: Transfer): void {
  let token = Token.load(
    event.address.toHexString() + event.params.tokenId.toString()
  );
  let contract = GumballNft.bind(event.address);

  let ipfsHash = "";
  if (
    !token &&
    event.params.from.toHexString() ==
      "0x0000000000000000000000000000000000000000"
  ) {
    let collection = Collection.load(contract.GBT().toHexString());
    if (collection) {
      collection.minted = collection.minted.plus(BigInt.fromString("1"));
      collection.save();
    }
    token = new Token(
      event.address.toHexString() + event.params.tokenId.toString()
    );
    token.tokenId = event.params.tokenId;
    let baseURI = contract.baseTokenURI();
    baseURI = baseURI.trim();
    token.baseURI = baseURI;
    token.available = false;
    token.owner = event.params.to;
    token.collection = event.address;
    token.tokenURI = "/" + token.tokenId.toString();
    token.imageURI = "N/A";
    token.name = "N/A";
    token.timestamp = event.block.timestamp;
    token.staked = false;
    if (baseURI.includes("mypinata.cloud/ipfs/")) {
      ipfsHash = baseURI.split("mypinata.cloud/ipfs/")[1];
    } else if (baseURI.includes("https://ipfs.io/ipfs/")) {
      ipfsHash = baseURI.split("//ipfs.io/ipfs/")[1];
    } else if (baseURI.includes("ipfs://")) {
      ipfsHash = baseURI.split("pfs://")[1];
    } else if (baseURI.includes(".ipfs")) {
      ipfsHash = baseURI.split("ttps://")[1];
      let longest = ipfsHash.split(".");
      // ipfsHash = longest[0] + "/" + event.params.tokenId.toString();
    }
    if (ipfsHash.includes("/")) ipfsHash = ipfsHash.split("/")[0];
    ipfsHash = ipfsHash + "/" + event.params.tokenId.toString();

    createTokenMetadata(ipfsHash, token.id);
    token.baseURI = baseURI;

    token.save();
  } else if (token && event.params.to == event.address) {
    token.available = true;
    token.owner = event.params.to;
    token.save();
  } else if (token && event.params.from == event.address) {
    token.available = false;
    token.owner = event.params.to;
    token.save();
  } else if (token) {
    token.available = false;
    token.owner = event.params.to;
    token.save();
  } else {
    log.error("Token #{} not created", [event.params.tokenId.toString()]);
  }
}
