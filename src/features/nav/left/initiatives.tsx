import { Link } from 'react-router-dom';
import styles from '@scss/side.module.scss';
import { useDisclosure } from '@chakra-ui/react';
import ProposalModal from '@features/proposal/proposalCreationModal/ProposalModal';
import ProposalModalButton from '@features/proposal/proposalCreationModal/ProposalModalButton';

function MenuLeftInitiatives() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <div className={styles['side-wrapper']}>
        <div className={styles['side-title']}>Initatives</div>
        <div className={styles['side-menu']}>
          <ProposalModalButton onOpen={onOpen} />
          <ProposalModal isOpen={isOpen} onClose={onClose} />
          <Link to="/proposals-vaults">
            <i className="material-symbols-outlined">account_balance</i>
            Vaults
          </Link>
          <Link to="/proposals-initiatives">
            <i className="material-symbols-outlined">tenancy</i>
            Funding
          </Link>
        </div>
      </div>
    </>
  );
}

export default MenuLeftInitiatives;