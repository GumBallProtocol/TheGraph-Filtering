import {
  Address, BigInt,
  ipfs,
  json,
  JSONValueKind,
  log,
  store
} from '@graphprotocol/graph-ts';
import {
  GumballNft,
  Approval,
  ApprovalForAll,
  ExactSwap as ExactSwapEvent,
  Redeem,
  Swap as SwapEvent,
  Transfer,
  SetBaseURI,
} from '../generated/templates/GumballNft/GumballNft';
import { Swap, Token, Attribute, Collection } from '../generated/schema';

export function handleExactSwap(event: ExactSwapEvent): void {
  let swap = new Swap(event.block.hash.toHexString());
  swap.sender = event.params.user;
  swap.amount = BigInt.fromU32(event.params.id.length);
  swap.collection = event.address;
  swap.eventType = 'exact_swap';
  swap.save();
}


export function handleRedeem(event: Redeem): void {
  let swap = new Swap(event.block.hash.toHexString());
  swap.sender = event.params.user;
  swap.amount = BigInt.fromU32(1);
  swap.collection = event.address;
  swap.eventType = 'redeem';
  swap.save();
}

export function handleSwap(event: SwapEvent): void {
  let swap = new Swap(event.block.hash.toHexString());
  swap.sender = event.params.user;
  swap.amount = event.params.amount;
  swap.collection = event.address;
  swap.eventType = 'swap';
  swap.save();
}

export function handleSetBaseURI(event: SetBaseURI): void {
  log.error("Handle set Base URI: {}", [event.address.toHexString()])
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
    }
    else if (baseURI.includes("https://ipfs.io/ipfs/")) {
      ipfsHash = baseURI.split("//ipfs.io/ipfs/")[1];
    }
    else if (baseURI.includes("ipfs://")) {
      ipfsHash = baseURI.split("pfs://")[1];
    }
    else if (baseURI.includes(".ipfs")) {
      ipfsHash = baseURI.split("ttps://")[1];
      let longest = ipfsHash.split('.');
      ipfsHash = longest[0];

    }
    if (ipfsHash.includes("/"))
      ipfsHash = ipfsHash.split("/")[0];
    ipfsHash = ipfsHash + "/1"
    let metadata = ipfs.cat(ipfsHash);
    if (!metadata) {
      metadata = ipfs.cat(ipfsHash);
    }
    if (metadata) {
      const value = json.fromBytes(metadata).toObject()
      if (value) {
        const image = value.get('image')
        const description = value.get('description')
        if (image && !image.isNull() && image.kind == JSONValueKind.STRING) {
          let temp_image = image.toString()
          collection.image = temp_image
        }
        if (description && !description.isNull() && description.kind == JSONValueKind.STRING)
          collection.description = description.toString();
      }
    }
    collection.save();
    let total = collection.minted.toString();
    let x = parseInt(total)
    x = trunc(x)
    let attMap = new Map<string, number>();
    for (let i = 0; i < x; i++) {
      let token = Token.load(event.address.toHexString() + BigInt.fromString(`${i}`).toString());
      if (token) {
        // baseURI = contract.tokenURI(BigInt.fromString(`${i}`))
        token.baseURI = baseURI;
        let ipfsHash2 = ""
        if (baseURI.includes("mypinata.cloud/ipfs/")) {
          ipfsHash2 = baseURI.split("mypinata.cloud/ipfs/")[1];
        }
        else if (baseURI.includes("https://ipfs.io/ipfs/")) {
          ipfsHash2 = baseURI.split("//ipfs.io/ipfs/")[1];
        }
        else if (baseURI.includes("ipfs://")) {
          ipfsHash2 = baseURI.split("pfs://")[1];
        }
        else if (baseURI.includes(".ipfs")) {
          ipfsHash2 = baseURI.split("ttps://")[1];
          let longest = ipfsHash2.split('.');
          ipfsHash2 = longest[0];
        }
        if (ipfsHash2.includes("/"))
          ipfsHash2 = ipfsHash2.split("/")[0];
        ipfsHash2 = ipfsHash2 + "/" + i.toString()
        let metadata = ipfs.cat(ipfsHash2);
        if (!metadata) {
          metadata = ipfs.cat(ipfsHash2);
        }
        if (metadata) {
          const value = json.fromBytes(metadata).toObject()
          if (value) {
            const image = value.get('image')
            const name = value.get('name')

            if (name && !name.isNull() && name.kind === JSONValueKind.STRING) {
              token.name = name.toString().trim();
            }
            if (image && !image.isNull() && image.kind === JSONValueKind.STRING) {
              let temp_image = image.toString().trim();
              token.imageURI = temp_image
            }

            let atts = value.get('attributes')
            let symbol = contract.symbol();
            if (atts && !atts.isNull() && atts.kind == JSONValueKind.ARRAY) {
              let atts_array = atts.toArray();
              token.attributes = [];
              let s = token.attributes;
              for (let i = 0; i < atts_array.length; i++) {
                let item = atts_array[i].toObject();
                const value_att = item.get('value');
                const trait = item.get('trait_type');
                if (trait && value_att && !value_att.isNull() && !trait.isNull() && trait.kind === JSONValueKind.STRING && value_att.kind === JSONValueKind.STRING) {
                  let attribute = Attribute.load(symbol + trait.toString().trim() + value_att.toString().trim())
                  if (attribute && !attMap.has(attribute.id.toString())) {
                    store.remove('Attribute', attribute.id);
                    attMap.set(attribute.id.toString(), 1);
                  }
                  if (!attribute) {
                    attribute = new Attribute(symbol + trait.toString().trim() + value_att.toString().trim())
                    attribute.trait_type = trait.toString().trim();
                    attribute.value = value_att.toString().trim();
                    attribute.collection = event.address;
                    attribute.count = BigInt.fromString("0");
                  }
                  attribute.count = attribute.count.plus(BigInt.fromString("1"));
                  attribute.save();
                  s.push(attribute.id);
                }
              }
              token.attributes = s;
            }
          }
        }
        else {
          log.error("ERROR METADATAA: {}", [ipfsHash2])
        }

        token.save();
      }
      else {
        log.error("TOKEN NOT FOUND: {}", [event.address.toHexString() + i.toString()])
      }
    }
  }
}

export function handleTransfer(event: Transfer): void {
  let token = Token.load(event.address.toHexString() + event.params.tokenId.toString());
  let contract = GumballNft.bind(event.address);

  let ipfsHash = ""
  if (!token && event.params.from.toHexString() == "0x0000000000000000000000000000000000000000") {
    let collection = Collection.load(contract.GBT().toHexString());
    if (collection) {
      collection.minted = collection.minted.plus(BigInt.fromString("1"));
      collection.save();
    }
    token = new Token(event.address.toHexString() + event.params.tokenId.toString());
    token.tokenId = event.params.tokenId;
    let baseURI = contract.baseTokenURI();
    baseURI = baseURI.trim()
    token.baseURI = baseURI;
    token.available = false;
    token.owner = event.params.to;
    token.collection = event.address;
    token.tokenURI = "/" + token.tokenId.toString();
    token.attributes = []
    token.imageURI = "N/A";
    token.name = "N/A";
    token.staked = false;
    if (baseURI.includes("mypinata.cloud/ipfs/")) {
      ipfsHash = baseURI.split("mypinata.cloud/ipfs/")[1];
    }
    else if (baseURI.includes("https://ipfs.io/ipfs/")) {
      ipfsHash = baseURI.split("//ipfs.io/ipfs/")[1];
    }
    else if (baseURI.includes("ipfs://")) {
      ipfsHash = baseURI.split("pfs://")[1];
    }
    else if (baseURI.includes(".ipfs")) {
      ipfsHash = baseURI.split("ttps://")[1];
      let longest = ipfsHash.split('.');
      // ipfsHash = longest[0] + "/" + event.params.tokenId.toString();
    }
    if (ipfsHash.includes("/"))
      ipfsHash = ipfsHash.split("/")[0];
    ipfsHash = ipfsHash + "/" + event.params.tokenId.toString()
    let metadata = ipfs.cat(ipfsHash);
    if (!metadata) {
      log.error("ERROR METADATA ON MINT: {}", [ipfsHash])
      metadata = ipfs.cat(ipfsHash);
    //   if (!metadata) {
    //     log.error("ERROR METADATA 2ND TRY: {}", [ipfsHash])
    //     metadata = ipfs.cat(ipfsHash);
    //   }
    }
    if (metadata) {
      const value = json.fromBytes(metadata).toObject()
      if (value) {
        const image = value.get('image')
        const name = value.get('name')

        if (name && !name.isNull() && name.kind === JSONValueKind.STRING) {
          token.name = name.toString().trim();
        }
        if (image && !image.isNull() && image.kind === JSONValueKind.STRING) {
          token.imageURI = image.toString().trim();
        }

        let atts = value.get('attributes')
        let symbol = contract.symbol();
        if (atts && !atts.isNull()) {
          let atts_array = atts.toArray();
          let s = token.attributes;
          for (let i = 0; i < atts_array.length; i++) {
            let item = atts_array[i].toObject();
            const value_att = item.get('value');
            const trait = item.get('trait_type');
            if (trait && value_att && !value_att.isNull() && !trait.isNull() && trait.kind === JSONValueKind.STRING && value_att.kind === JSONValueKind.STRING) {
              let attribute = Attribute.load(symbol + trait.toString().trim() + value_att.toString().trim())
              if (!attribute) {
                attribute = new Attribute(symbol + trait.toString() + value_att.toString())
                attribute.trait_type = trait.toString().trim();
                attribute.value = value_att.toString().trim();
                attribute.collection = event.address;
                attribute.count = BigInt.fromString("0");
              }
              attribute.count = attribute.count.plus(BigInt.fromString("1"));
              attribute.save();
              s.push(attribute.id);
            }
          }
          token.attributes = s;
        }
      }
    }
    token.save();
  }
  else if (token && event.params.to == event.address) {
    token.available = true;
    token.owner = event.params.to;
    token.save();
  }
  else if (token && event.params.from == event.address) {
    token.available = false;
    token.owner = event.params.to;
    token.save();
  }
  else if (token) {
    token.available = false;
    token.owner = event.params.to;
    token.save();
  }
  else{
    log.error("Token #{} not created", [event.params.tokenId.toString()])
  }
}