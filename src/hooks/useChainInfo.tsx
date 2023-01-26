import { useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  currentBlockIntervalAtom,
  currentBlockHeightAtom,
  currentChainIDAtom,
  currentContractForgeAtom,
  currentContractGovTokenAtom
} from '@recoil/chainInfo/atoms';
import { useLCDClient, useWallet } from '@terra-money/wallet-provider';
import getChainDeploy from '@utilities/getValues';

const useChainInfo = () => {
  const lcd = useLCDClient();
  const connection = useWallet();
  const chainID = useWallet().network.chainID;
  const [currentBlockHeight, setCurrentBlockHeight] = useRecoilState<any>(
    currentBlockHeightAtom
  );
  const setCurrentBlockInterval = useSetRecoilState(currentBlockIntervalAtom);
  const [currentChainID, setCurrentChainID] =
    useRecoilState<string>(currentChainIDAtom);
  const [currentContractForge, setCurrentContractForge] =
    useRecoilState<string>(currentContractForgeAtom);
  const [currentContractGovToken, setCurrentContractGovToken] =
    useRecoilState<string>(currentContractGovTokenAtom);

  const getCurrentChainID = async () => {
    const currentChainID: string = connection.network.chainID;
    return currentChainID;
  };
  const setCurrentChainIDToState = async () => {
    const currentChainID = await getCurrentChainID();
    setCurrentChainID(currentChainID);
  };
  const getCurrentContractForge = () => {
    const contractForge = String(getChainDeploy(chainID, 'forge'));
    return contractForge;
  };
  const setCurrentContractForgeToState = () => {
    const contractForge = getCurrentContractForge();
    setCurrentContractForge(contractForge);
  };
  const getCurrentContractGovToken = () => {
    const contractGovToken = String(getChainDeploy(chainID, 'token'));
    return contractGovToken;
  };

  const setCurrentContractGovTokenToState = () => {
    const contractGovToken = getCurrentContractGovToken();
    setCurrentContractGovToken(contractGovToken);
  };

  const getCurrentBlockInterval = () => {
    const newBlockInterval = Number(getChainDeploy(chainID, 'interval'));
    if (typeof newBlockInterval === 'number') {
      console.log('blockInterval is a number: ', newBlockInterval);
    } else {
      console.error('blockInterval is not a number: ', newBlockInterval);
    }
    return newBlockInterval;
  };

  const setCurrentBlockIntervalToState = () => {
    const blockInterval = getCurrentBlockInterval();
    setCurrentBlockInterval(blockInterval);
  };

  const getCurrentBlockHeight = async () => {
    const newBlockHeight = Number.parseInt(
      (await lcd.tendermint.blockInfo()).block.header.height
    );
    return newBlockHeight;
  };

  const setCurrentBlockHeightToState = async () => {
    const blockHeight = await getCurrentBlockHeight();
    setCurrentBlockHeight(blockHeight);
  };

  useEffect(() => {
    setCurrentBlockIntervalToState();
    setCurrentBlockHeightToState();
    setCurrentContractGovTokenToState();
    setCurrentChainIDToState();
    setCurrentContractForgeToState();
  }, []);

  useEffect(() => {
    const blockInterval = getCurrentBlockInterval();
    const interval = setInterval(async () => {
      return setCurrentBlockHeight(await getCurrentBlockHeight());
    }, blockInterval);
    return () => clearInterval(interval);
  }, []);

  return {
    currentBlockHeight,
    currentChainID,
    currentContractForge,
    currentContractGovToken
  };
};

export default useChainInfo;
