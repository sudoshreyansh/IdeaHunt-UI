import BaseModal from './BaseModal'
import PrimaryButton from '../button/Primary';
import ModalContext from '../../contexts/Modal';
import { useContext, useState } from 'react';
import ContractContext from '../../contexts/Contract';
import TransactionContext from '../../contexts/Transaction';
import SecondaryButton from '../button/Secondary';

const defaultTokenGate = '0x0000000000000000000000000000000000000000';

function NewBoardForm({ onSubmit, onCancel }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [voteToken, setVoteToken] = useState('');
    const [proposalToken, setProposalToken] = useState('');
    const [submitting, setSubmitting] = useState(false);

    function submit() {
        if ( name === '' ) return;
        if ( submitting ) return;
        setSubmitting(true);

        onSubmit([
            name,
            description,
            proposalToken === '' ? defaultTokenGate : proposalToken,
            voteToken === '' ? defaultTokenGate : voteToken,
            0
        ]);
    }

    return (
        <>
            <div className="mb-1">Board Name:</div>
            <input type="text" value={name} className="border-stone-600 border-solid border py-1 px-2 mb-4 w-full block" onChange={e => setName(e.target.value)} />
            
            <div className="mb-1">Board Description:</div>
            <textarea value={description} className="border-stone-600 border-solid border py-1 px-2 mb-4 w-full h-20 resize-none" onChange={e => setDescription(e.target.value)}></textarea>
            
            <div className="mb-1">Proposal Rights NFT <span className="italic">(default is the Hunter NFT, Ethereum Rinkeby only)</span>:</div>
            <input type="text" value={proposalToken} placeholder={defaultTokenGate} className="border-stone-600 border-solid border py-1 px-2 mb-4 w-full block" onChange={e => setProposalToken(e.target.value)} />

            <div className="mb-1">Voters Rights NFT <span className="italic">(default is the Hunter NFT, Ethereum Rinkeby only)</span>:</div>
            <input type="text" value={voteToken} placeholder={defaultTokenGate} className="border-stone-600 border-solid border py-1 px-2 mb-8 w-full block" onChange={e => setVoteToken(e.target.value)} />
            
            <PrimaryButton value="Submit" deactivated={submitting} onClick={submit} />
            <SecondaryButton value="Back" onClick={onCancel} />
        </>
    )
}

function NewBoardModal() {
    const displayModal = useContext(ModalContext);
    const { contract } = useContext(ContractContext);
    const addTransaction = useContext(TransactionContext);

    function onSubmit(form) {
        const tx = contract.addBoard(...form, { gasLimit: 300000 });
        addTransaction({
            id: Date.now(),
            text: `${form[0]} is being added. It may take a few minutes.`,
            successText: `${form[0]} is added. Please refresh to continue.`,
            failureText: `There was a problem with adding ${form[0]}. Please try again.`,
            promise: tx,
            next: () => displayModal({name: 'NO_MODAL'}),
        })
    }

    function onCancel() {
        displayModal({
            name: 'NO_MODAL'
        });
    }

    return (
        <BaseModal>
            <div className="font-bold text-2xl mb-4">
                Add New Idea Board
            </div>
            <NewBoardForm onSubmit={onSubmit} onCancel={onCancel} />
        </BaseModal>
    )
}

export default NewBoardModal;