import { Address, BigInt,
   ipfs,
    json, 
    log
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

export function handleSetBaseURI(event: SetBaseURI): void{
    let contract = GumballNft.bind(event.address);
    let collection_id = contract.tokenContract();
    let collection = Collection.load(collection_id.toHexString());
    let baseURI = event.params.uri;
    let ipfsHash = "";
    if(baseURI && collection){
        collection.baseURI = baseURI;
        if(baseURI.includes("mypinata.cloud/ipfs/")){
          ipfsHash = baseURI.split("mypinata.cloud/ipfs/")[1];
        }
        else if (baseURI.includes("https://ipfs.io/ipfs/")) {
          ipfsHash = baseURI.split("//ipfs.io/ipfs/")[1];
        }
        else if (baseURI.includes("ipfs://")) {
          ipfsHash = baseURI.split("pfs://")[1];
        }
        if(ipfsHash.includes("/"))
            ipfsHash = ipfsHash.split("/")[0];
      ipfsHash = ipfsHash +"/1"
      let metadata = ipfs.cat(ipfsHash);
      if(metadata){
        const value = json.fromBytes(metadata).toObject()
        if (value){
          const image = value.get('image')
          const description = value.get('description')
          if(image){
            if(image.toString().includes("https"))
              collection.image = image.toString();
            else
              collection.image = baseURI.toString() + image.toString();
          }
            if(description)
              collection.description = description.toString();
        }
      }
      collection.save();
      let total = collection.totalSupply.toString();
      let x = parseInt(total)
      x = trunc(x)
      for(let i = 0; i <= x; i++){
        let token = Token.load(event.address.toHexString() + i.toString());
        if(token){
          let ipfsHash2 = ""
          if(baseURI.includes("mypinata.cloud/ipfs/")){
            ipfsHash2 = baseURI.split("mypinata.cloud/ipfs/")[1];
          }
          else if (baseURI.includes("https://ipfs.io/ipfs/")) {
            ipfsHash2 = baseURI.split("//ipfs.io/ipfs/")[1];
          }
          else if (baseURI.includes("ipfs://")) {
            ipfsHash2 = baseURI.split("ipfs://")[1];
          }
          if(ipfsHash2.includes("/"))
            ipfsHash2 = ipfsHash2.split("/")[0];
          ipfsHash2 = ipfsHash2+"/"+i.toString()
          let metadata = ipfs.cat(ipfsHash2);
      
          if (metadata) {
            const value = json.fromBytes(metadata).toObject()
            if (value) {
              const image = value.get('image')
              const name = value.get('name')
      
              if (name) {
                token.name = name.toString()
              }
              if (image) {
                log.error("IMAGEEE: {}, ID: {}", [image.toString(), event.address.toHexString() + i.toString()] )
                if(image.toString().includes('https'))
                  token.imageURI = image.toString()
                else
                  token.imageURI = baseURI + image.toString()
                  // token.imageURI = ipfsHash;
              }
      
              let atts = value.get('attributes')
              let symbol = contract.symbol();
              if (atts) {
                let atts_array = atts.toArray();
                token.attributes = [];
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
          else{
            log.error("ERROR METADATAA: {}", [ipfsHash2])
          }
      
          token.save();
        }
        else{
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
    token = new Token(event.address.toHexString() + event.params.tokenId.toString());
    token.tokenId = event.params.tokenId;
    let baseURI = contract.tokenURI(token.tokenId);
    token.baseURI = baseURI;
    token.available = false;
    token.owner = event.params.to;
    token.collection = event.address;
    token.tokenURI = "/" + token.tokenId.toString();
    token.attributes = []
    token.imageURI = "N/A/N";
    token.name = "N/A/N";
    token.staked = false;
    if(baseURI.includes("mypinata.cloud/ipfs/")){
      ipfsHash = baseURI.split("mypinata.cloud/ipfs/")[1];
    }
    else if (baseURI.includes("https://ipfs.io/ipfs/")) {
      ipfsHash = baseURI.split("//ipfs.io/ipfs/")[1];
    }
    else if (baseURI.includes("ipfs://")) {
      ipfsHash = baseURI.split("ipfs://")[1];
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
          if(image.toString().includes('https'))
            token.imageURI = image.toString()
          else
            token.imageURI = token.baseURI + image.toString()
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
  else if(token){
    token.available = false;
    token.owner = event.params.to;
    token.save();
  }
}