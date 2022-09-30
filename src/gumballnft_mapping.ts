import { BigInt,
   ipfs,
    json 
  } from '@graphprotocol/graph-ts';
import {
  GumballNft,
  Approval,
  ApprovalForAll,
  ExactSwap as ExactSwapEvent,
  Redeem,
  Swap as SwapEvent,
  Transfer,
} from '../generated/templates/GumballNft/GumballNft';
import { Swap, Token, Attribute, Collection } from '../generated/schema';

export function handleExactSwap(event: ExactSwapEvent): void {
  let swap = new Swap(event.block.hash.toHexString());
  swap.sender = event.params.user;
  swap.amount = BigInt.fromU32(event.params.id.length);
  swap.eventType = 'exact_swap';
  swap.save();
}


export function handleRedeem(event: Redeem): void {
  let swap = new Swap(event.block.hash.toHexString());
  swap.sender = event.params.user;
  swap.amount = BigInt.fromU32(1);
  swap.eventType = 'redeem';
  swap.save();
}

export function handleSwap(event: SwapEvent): void {
  let swap = new Swap(event.block.hash.toHexString());
  swap.sender = event.params.user;
  swap.amount = event.params.amount;
  swap.eventType = 'swap';
  swap.save();
}

export function handleTransfer(event: Transfer): void {
  let token = Token.load(event.address.toHexString() + event.params.tokenId.toString());
  let contract = GumballNft.bind(event.address);

  let ipfsHash = ""
  if (!token && event.params.from.toHexString() == "0x0000000000000000000000000000000000000000") {
    token = new Token(event.address.toHexString() + event.params.tokenId.toString());
    token.tokenId = event.params.tokenId;
    let baseURI = contract.tokenURI(token.tokenId);
    token.available = false;
    token.owner = event.params.to;
    token.collection = event.address;
    token.tokenURI = "/" + token.tokenId.toString();
    token.attributes = []
    token.imageURI = "N/A/N";
    token.name = "N/A/N";
    if (baseURI.includes("https://ipfs.io/ipfs/")) {
      ipfsHash = baseURI.split("//ipfs.io/ipfs/")[1];
    }
    if (baseURI.includes("ipfs://")) {
      ipfsHash = baseURI.split("pfs://")[1];
    }
    let metadata = ipfs.cat(ipfsHash);

    if (metadata) {
      const value = json.fromBytes(metadata).toObject()
      if (value) {
        const image = value.get('image')
        const name = value.get('name')

        if (name) {
          token.name = name.toString()
        }
        if (image) {
          token.imageURI = image.toString()
          // token.imageURI = ipfsHash;
        }

        let atts = value.get('attributes')
        let symbol = contract.symbol();
        if (atts) {
          let atts_array = atts.toArray();
          let s = token.attributes;
          for (let i = 0; i < atts_array.length; i++) {
            let item = atts_array[i].toObject();
            const value = item.get('value');
            const trait = item.get('trait_type');
            if (trait && value && trait.toString() != "Rarity Rank") {
              let attribute = Attribute.load(symbol + trait.toString() + value.toString())
              if (!attribute) {
                attribute = new Attribute(symbol + trait.toString() + value.toString())
                attribute.trait_type = trait.toString();
                attribute.value = value.toString();
                attribute.collection = event.address;
              }
              attribute.save();
              s.push(attribute.id);

            } else {
              return
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

}