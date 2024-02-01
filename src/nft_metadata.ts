import { Token } from "./../generated/schema";
import {
  Bytes,
  DataSourceContext,
  DataSourceTemplate,
  dataSource,
  log,
  ipfs,
  json,
  JSONValueKind,
} from "@graphprotocol/graph-ts";
import { CollectionMeta, TokenAttribute } from "../generated/schema";
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
import { handleSetBaseURI } from "./gumballnft_mapping";

export function createIPFSMetadata(uri: string, address: string): void {
  //Creating a new key:value for the metadata entity
  let context = new DataSourceContext();

  // Set the key:value that we want to pass into the metadata entity
  context.setString("IPFSHash", uri);
  context.setString("Collection", address);

  // instantiates the ipfs template
  // the params string in createWithContext() should house the uri
  // the context should be the key:value store that we want to pass into the metadata entity
  DataSourceTemplate.createWithContext("CollectionMetadata", [uri], context);
}

//Creating the Collection metadata function
export function handleCollectionMetadata(content: Bytes): void {
  //creating the variable 'ctx' as context
  let ctx = dataSource.context();
  let ipfsHash = ctx.getString("IPFSHash");
  let collectionId = ctx.getString("Collection");
  let collectionMeta = new CollectionMeta(collectionId + "-" + ipfsHash);

  let value = json.fromBytes(content).toObject();
  let description = value.get("description");
  let image = value.get("image");
  let name = value.get("name");

  if (value) {
    if (image) collectionMeta.image = image.toString();
    if (description) collectionMeta.description = description.toString();
    if (name) collectionMeta.name = name.toString();
  }
  collectionMeta.content = content.toString();
  collectionMeta.collection = collectionId;
  collectionMeta.save();
}

export function createTokenMetadata(uri: string, token: string): void {
  //Creating a new key:value for the metadata entity
  let context = new DataSourceContext();

  // Set the key:value that we want to pass into the metadata entity
  context.setString("IPFSHash", uri);
  context.setString("Token", token);

  // instantiates the ipfs template
  // the params string in createWithContext() should house the uri
  // the context should be the key:value store that we want to pass into the metadata entity
  DataSourceTemplate.createWithContext("TokenMetadata", [uri], context);
}

export function handleTokenMetadata(content: Bytes): void {
  let ctx = dataSource.context();
  let id = "";
  log.debug("log number 1", []);
  if (ctx.getString("IPFSHash")) id = ctx.getString("IPFSHash");
  {
    log.warning("ID = {}", [id]);
  }

  let tokenId = "";
  log.debug("log number 2", []);
  if (ctx.getString("Token")) {
    tokenId = ctx.getString("Token");
  }
  log.debug("log number 3", []);

  let value = json.fromBytes(content).toObject();
  let traitType = "";
  let traitValue = "";
  log.debug("log number 4", [content.toHexString()]);
  if (value) {
    //Getting the array of attributes

    //get the name
    traitType = "name";
    let name = value.get("name");
    if (name) {
      let tokenAttributeName = TokenAttribute.load(
        id + "-" + tokenId + "-" + traitType
      );
      log.debug("log number 5", []);

      if (!tokenAttributeName) {
        tokenAttributeName = new TokenAttribute(
          id + "-" + tokenId + "-" + traitType
        );
        log.debug("log number 6", []);
        tokenAttributeName.value = name.toString();
        log.debug("log number 7", []);
        tokenAttributeName.attribute = traitType;
        tokenAttributeName.token = tokenId;
        tokenAttributeName.save();
      } else {
        log.warning("We found duplicate id: {}, for token: {}", [
          id + "-" + traitType,
          tokenId,
        ]);
      }
    }
    //get the image
    traitType = "image";
    let image = value.get("image");
    log.debug("log number 8", []);
    if (image) {
      let tokenAttributeImage = TokenAttribute.load(
        id + "-" + tokenId + "-" + traitType
      );
      log.debug("log number 9", []);

      if (!tokenAttributeImage) {
        let tokenAttributeImage = new TokenAttribute(
          id + "-" + tokenId + "-" + traitType
        );
        log.debug("log number 10", []);
        tokenAttributeImage.value = image.toString();
        log.debug("log number 11", []);
        tokenAttributeImage.attribute = traitType;
        tokenAttributeImage.token = tokenId;
        log.debug("log number 12", []);
        tokenAttributeImage.save();
      } else {
        log.warning("We found duplicate id: {}, for token: {}", [
          id + "-" + traitType,
          tokenId,
        ]);
      }
    }
    // error is below here
    let attributes = value.get("attributes");
    if (attributes) {
      let attributeArray = attributes.toArray();
      let arrayLength = attributeArray.length;
      for (let i = 0; i < arrayLength; i++) {
        let attributeObject = attributeArray[i].toObject();
        let traitTypeJSON = attributeObject.get("trait_type");
        let traitValueJSON = attributeObject.get("value");
        if (traitTypeJSON && traitValueJSON) {
          log.debug("log number 13", []);
          traitType = traitTypeJSON.toString();
          log.debug("log number 14", []);
          traitValue = traitValueJSON.toString();
          log.debug("log number 15", []);
          //Getting the specific array of attributes and their values
          if (traitType && traitValue) {
            let tokenAttribute = TokenAttribute.load(
              id + "-" + tokenId + "-" + traitType
            );
            if (!tokenAttribute) {
              tokenAttribute = new TokenAttribute(
                id + "-" + tokenId + "-" + traitType
              );
              tokenAttribute.attribute = traitType;
              tokenAttribute.value = traitValue;
              tokenAttribute.token = tokenId;
              log.debug("log number 16", []);
              tokenAttribute.save();
            } else {
              log.warning("We found duplicate id: {}, for token: {}", [
                id + "-" + traitType,
                tokenId,
              ]);
            }
          }
        }
      }
    }
  }
}
