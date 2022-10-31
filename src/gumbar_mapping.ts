import { BigInt, json, ipfs, log } from "@graphprotocol/graph-ts"
import {Collection, Token} from '../generated/schema'
import {
  DepositNFT,
  WithdrawNFT
} from '../generated/templates/Gumbar/Gumbar';



export function handleDepositNFT(event: DepositNFT): void {
    let token = Token.load(event.params.colleciton.toHexString()+event.params.id.toString());
    if(token){
        token.staked = true;
        token.save();
    }
}


export function handleWithdrawNFT(event: WithdrawNFT): void {
    let token = Token.load(event.params.collection.toHexString()+event.params.id.toString());
    if(token){
        token.staked = false;
        token.save();
    }
}