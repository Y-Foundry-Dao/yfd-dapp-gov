type ChainDeploy = {
  chainID: string;
  config: { forge: string; token: string }[];
};

const pisco: ChainDeploy[] = [
  {
    chainID: 'pisco-1',
    config: [
      {
        forge:
          'terra1s5hg4kusnnp5q8r8l0das4tftd50xcve4e2l95eqjy3fgducekfsw6yder',
        token:
          'terra1293l9rgqk5vxndaeqmengssg3pdch57qpepgslh7p2sg3lqd87rss8du4s'
      }
    ]
  }
];

const testnet: ChainDeploy[] = [
  {
    chainID: 'testnet',
    config: [
      {
        forge: pisco[0].config[0].forge,
        token: pisco[0].config[0].token
      }
    ]
  }
];

export const chainDeploy = [...pisco, ...testnet];
