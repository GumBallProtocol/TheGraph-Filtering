import { log, BigInt, BigDecimal, Address } from '@graphprotocol/graph-ts'


export let ZERO_BI = BigInt.fromI32(0)
export let ONE_BI = BigInt.fromI32(1)
export let ZERO_BD = BigDecimal.fromString('0')
export let ONE_BD = BigDecimal.fromString('1')
export let BI_18 = BigInt.fromI32(18)

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
    let bd = BigDecimal.fromString('1')
    for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
      bd = bd.times(BigDecimal.fromString('10'))
    }
    return bd
  }
  export function bigDecimalExp18(): BigDecimal {
    return BigDecimal.fromString('1000000000000000000')
  }
  export function convertTokenToDecimal(tokenAmount: BigInt): BigDecimal {
    return tokenAmount.toBigDecimal().div(bigDecimalExp18());
  }