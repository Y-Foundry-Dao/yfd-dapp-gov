import useMsg from './useMsg';
import queryAllProposalContracts from 'utilities/messagesQuery/forge/queryAllProposalContracts';
import { FORGE_TEST } from 'utilities/variables/variables';
import { useEffect, useState } from 'react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import queryBalance from 'utilities/messagesQuery/cw20/queryBalance';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import txHashAtom from 'recoil/txHash/atom';
import queryBalanceDetail from 'utilities/messagesQuery/forge/queryBalanceDetail';
import stakedYFDAtom from 'recoil/stakedYFD/atom';
import queryAllVaultProposals from 'utilities/messagesQuery/forge/queryAllVaultProposals';
import queryVaultFundingMath from 'utilities/messagesQuery/forge/queryVaultFundingMath';
import { inputDevelopmentCost, inputNFTAmount } from 'recoil/input/atoms';
import convertToBase from 'utilities/converters/convertToBase';
import convertFromBase from 'utilities/converters/convertFromBase';

const useContractForge = () => {
  const { queryMsg } = useMsg();
  const [proposals, setProposals] = useState<any>([]);
  const [vaultProposals, setVaultProposals] = useState<any>([]);
  const [emergencies, setEmergencies] = useState<any>([]);
  const [requiredInitialFunding, setRequiredInitialFunding] = useState<any>(0);
  const [tokenBalance, setTokenBalance] = useState('0');
  const connectedWallet = useConnectedWallet();
  const txHashInRecoil = useRecoilValue(txHashAtom);
  const developmentCost = useRecoilValue(inputDevelopmentCost);
  const nftAmount = useRecoilValue(inputNFTAmount);
  const setStakedYFD = useSetRecoilState(stakedYFDAtom);

  const getAllProposalContracts = async () => {
    const response = await queryMsg(FORGE_TEST, queryAllProposalContracts());
    return response;
  };

  const getAllVaultProposals = async () => {
    const response = await queryMsg(FORGE_TEST, queryAllVaultProposals());
    return response;
  };

  const setAllVaultProposalsToState = async () => {
    try {
      const vaultProposals: any = await getAllVaultProposals();
      setVaultProposals(vaultProposals.proposals);
    } catch (e) {
      console.log('error', e);
    }
  };

  const setAllGovernanceProposalsToState = async () => {
    const governanceProposals: any = await getAllProposalContracts();
    setProposals(governanceProposals.proposals);
  };

  const getBalance = async () => {
    if (!connectedWallet) {
      return;
    }
    const response = await queryMsg(
      FORGE_TEST,
      queryBalance(connectedWallet?.walletAddress)
    );
    return response;
  };

  const setTokenBalanceToState = async () => {
    const tokenBalance: any = await getBalance();
    if (tokenBalance === undefined) {
      setTokenBalance('0');
      return;
    }
    setTokenBalance(tokenBalance.balance);
  };

  const getStakedYFD = async () => {
    if (!connectedWallet) {
      return;
    }
    const response = await queryMsg(
      FORGE_TEST,
      queryBalanceDetail(connectedWallet?.walletAddress)
    );
    return response;
  };

  const setStakedYFDToState = async () => {
    const stakedYFD: any = await getStakedYFD();
    if (stakedYFD === undefined) {
      // TODO: handle case where stakedYFD is undefined
      console.log('staked YFD is undefined');
      return;
    }
    setStakedYFD(stakedYFD.stakes);
  };

  const getVaultFundingMath = async () => {
    const devCostConverted = convertToBase(developmentCost);
    const response: any = await queryMsg(
      FORGE_TEST,
      queryVaultFundingMath(devCostConverted, nftAmount)
    );
    return response;
  };

  const setRequiredInitialFundingToState = async () => {
    const vaultFundingMath: any = await getVaultFundingMath();
    const convertedRequiredInitialFunding = convertFromBase(
      vaultFundingMath.strategist_min
    );
    setRequiredInitialFunding(convertedRequiredInitialFunding);
  };

  useEffect(() => {
    setAllGovernanceProposalsToState();
    setAllVaultProposalsToState();
  }, []);

  useEffect(() => {
    setRequiredInitialFundingToState();
  }, [developmentCost, nftAmount]);

  useEffect(() => {
    setTokenBalanceToState();
    setStakedYFDToState();
    // setAllEmergenciesToState();
  }, [connectedWallet, txHashInRecoil]);

  return {
    proposals,
    vaultProposals,
    emergencies,
    tokenBalance,
    requiredInitialFunding
  };
};

export default useContractForge;
