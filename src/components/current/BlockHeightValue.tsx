import { useEffect } from 'react';
import {
  useRecoilState,
  useRecoilValue,
  useRecoilValueLoadable,
  useRecoilRefresher_UNSTABLE
} from 'recoil';
import { Text, Tooltip, Spinner } from '@chakra-ui/react';
import Loading from '@components/NoticeLoading';
import styles from '@scss/app.module.scss';
import { currentBlockHeightAtom } from '@recoil/chainInfo/atoms';
import {
  addressHasFYFDAtom,
  addressCanVoteAtom,
  addressCanProposeGovAtom,
  addressCanProposeVaultAtom,
  addressCanProposeEmergencyAtom,
  estimatedFyfdConnectedAtom
} from '@recoil/connected/address/atoms';
import { selectMyFYFD, selectMyYFD } from '@recoil/connected/balance/selectors';
import {
  minFYFDEmergencyPropAtom,
  minFYFDGovPropAtom,
  minFYFDVaultPropAtom
} from '@recoil/governance/parameters/atoms';
import { FYFD_LOCK_DECAY_RATE } from '@var/chrono';
import useChainInfo from '@hooks/useChainInfo';
import NoticeLoading from '../NoticeLoading';

export default function CurrentBlockHeight() {
  const { currentChainID, currentAddress } = useChainInfo();
  const currentBlockHeight = useRecoilValue(currentBlockHeightAtom);
  const yfd = useRecoilValueLoadable(selectMyYFD);
  const refreshFYFD = useRecoilRefresher_UNSTABLE(selectMyFYFD);
  const fyfd = useRecoilValueLoadable(selectMyFYFD);
  const [canVote, setCanVote] = useRecoilState(addressCanVoteAtom);
  const [canVault, setCanVault] = useRecoilState(addressCanProposeVaultAtom);
  const [canGov, setCanGov] = useRecoilState(addressCanProposeGovAtom);
  const [canEmer, setCanEmer] = useRecoilState(addressCanProposeEmergencyAtom);
  const [hasFYFD, setHasFYFD] = useRecoilState(addressHasFYFDAtom);
  const [estimatedFYFD, setEstimatedFYFD] = useRecoilState(
    estimatedFyfdConnectedAtom
  );
  const minVault = useRecoilValue(minFYFDVaultPropAtom);
  const minGov = useRecoilValue(minFYFDGovPropAtom);
  const minEmergency = useRecoilValue(minFYFDEmergencyPropAtom);

  // to do: setup a estimatedFYFD using the amount of FYFD between the current block height and the last block height
  useEffect(() => {
    if (currentBlockHeight == 0) {
      // going to do nothing if the currentBlockHeight is empty
      return;
    }
    refreshFYFD();
    // add a check here to make sure the connected wallet is the same as the address in Recoil State
    // if the user has fyfd, set the hasFYFD state to true
    if (+fyfd.contents > 0) {
      setHasFYFD(true);
      const decay = FYFD_LOCK_DECAY_RATE * estimatedFYFD;
      console.log('Estimated FYFD decay: ', decay);
      setEstimatedFYFD(estimatedFYFD - decay);
    } else {
      // set hasFYFD to false if the user has no fyfd left
      setHasFYFD(false);
    }
    if (+fyfd.contents > 0) {
      setCanVote(true);
    } else {
      setCanVote(false);
    }
    if (+fyfd.contents >= +minVault && +fyfd.contents > 0) {
      setCanVault(true);
    } else {
      setCanVault(false);
    }
    if (+fyfd.contents >= +minGov && +minGov > 0 && +fyfd.contents > 0) {
      setCanGov(true);
    } else {
      setCanGov(false);
    }
    if (
      +fyfd.contents >= +minEmergency &&
      +minEmergency > 0 &&
      +fyfd.contents > 0
    ) {
      setCanEmer(true);
    } else {
      setCanEmer(false);
    }
    console.log(
      'currentBlockHeight [ ' + currentChainID + ' ]: ',
      currentBlockHeight,
      '\ncurrentAddress: ',
      currentAddress,
      '\nyfd: ',
      yfd.contents,
      'fyfd: ',
      fyfd.contents,
      'estimatedFYFD: ',
      estimatedFYFD,
      '\nhasFYFD: ',
      hasFYFD,
      'canVote: ',
      canVote,
      'canVault: ',
      canVault,
      'canGov: ',
      canGov,
      'canEmer: ',
      canEmer
    );
  }, [currentBlockHeight]);
  if (currentBlockHeight) {
    return <>{currentBlockHeight}</>;
  } else {
    return <NoticeLoading />;
  }
}