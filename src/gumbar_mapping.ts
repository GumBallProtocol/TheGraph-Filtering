import { BigInt, json, ipfs, log } from "@graphprotocol/graph-ts"
import {Collection, Token} from '../generated/schema'
import {
  DepositNFT,
  Gumbar,
  RewardPaid,
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

export function handleRewardPaid(event: RewardPaid): void {
    // call stking token to get gbt address
    let contract = Gumbar.bind(event.address);
    let gbt = contract.stakingToken();

    let collection = Collection.load(gbt.toHexString());

    if(collection){
        if(collection.rewards[event.params.rewardsToken.toString()]){
            collection.rewards[event.params.rewardsToken.toString()].plus(event.params.reward)
        }else{
            collection.rewards[event.params.rewardsToken.toString()] = event.params.reward
        }
        //collection.rewards = collection.rewards.plus(event.params.reward);
        collection.save();
    }
}