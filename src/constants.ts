export const PACKAGE_IDS = {
  testnet: '0xd21845143eb18c5a9135482f01f21470d266fcb58ac0305a95875f1d4cca25fa',
  mainnet: '0x4d6aa0933cafdd406873365b83da0d4d800e80a48cd917de5661030823773802',
} as const

export type Network = keyof typeof PACKAGE_IDS
