import { BigInt, json, ipfs, log } from "@graphprotocol/graph-ts"
import { Collection, Reward, Token } from '../generated/schema'
import {
    DepositNFT,
    Gumbar,
    RewardPaid,
    WithdrawNFT
} from '../generated/templates/Gumbar/Gumbar';



export function handleDepositNFT(event: DepositNFT): void {
    let token = Token.load(event.params.colleciton.toHexString() + event.params.id.toString());
    if (token) {
        token.staked = true;
        token.save();
    }
}


export function handleWithdrawNFT(event: WithdrawNFT): void {
    let token = Token.load(event.params.collection.toHexString() + event.params.id.toString());
    if (token) {
        token.staked = false;
        token.save();
    }
}

export function handleRewardPaid(event: RewardPaid): void {
    // call stking token to get gbt address
    let contract = Gumbar.bind(event.address);
    let gbt = contract.stakingToken();

    let collection = Collection.load(gbt.toHexString());

    if (collection) {
        let reward = Reward.load(gbt.toHexString() + event.params.rewardsToken.toHexString());
        if (!reward) {
            reward = new Reward(gbt.toHexString() + event.params.rewardsToken.toHexString());
            reward.tokenAddress = event.params.rewardsToken;
            reward.total = event.params.reward;

            if(!collection.rewards)
                collection.rewards = [gbt.toHexString() + event.params.rewardsToken.toHexString()];
            else{
                let temp = collection.rewards;
                if(temp){
                    temp.push(gbt.toHexString() + event.params.rewardsToken.toHexString())
                    collection.rewards = temp;
                }
            }
        } else {
            reward.total = reward.total.plus(event.params.reward);
        }
        reward.save();
        collection.save();
    }
}