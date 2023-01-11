import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil';
import { useConnectedWallet } from '@terra-money/wallet-provider';

import useChainInfo from '@hooks/useChainInfo';

import convertFromBase from 'utilities/converters/convertFromBase';

import { addressConnectedAtom } from '@recoil/connected/address/atoms';
import {
  selectFYFDConnected,
  selectYFDConnected
} from '@recoil/connected/balance/selectors';

export const myChain = () => {
  const chainInfo = useChainInfo();
  console.log('chain DATA: ', chainInfo);

  return chainInfo.currentChainID;
};

export const myYFD = () => {
  const response = useRecoilValueLoadable(selectYFDConnected);
  //console.log('{RECOIL} [MY] YFD Balance: ', response);
  const balance = parseFloat(convertFromBase(response.contents).toFixed(5));
  //console.log('{MY} hasValue YFD Balance: ', balance);
  return balance.toString();
};

export const myFYFD = () => {
  const response = useRecoilValueLoadable(selectFYFDConnected);
  //console.log('{RECOIL} [MY] --FYFD-- Balance: ', response);
  const balance = parseFloat(convertFromBase(response.contents).toFixed(5));
  //console.log('{MY} --FYFD-- Balance: ', balance);
  return balance.toString();
};

export default myChain;