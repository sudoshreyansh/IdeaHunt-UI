import { useContext, useState } from 'react';
import PrimaryButton from '../button/Primary';
import BaseModal from './BaseModal'
import ContractContext from '../../contexts/Contract';
import ModalContext from '../../contexts/Modal';
import TransactionContext from '../../contexts/Transaction';
import SecondaryButton from '../button/Secondary';

function ProposalModal({ boardID }) {
    const [idea, setIdea] = useState('');
    const [link, setLink] = useState('');
    const { contract } = useContext(ContractContext);
    const displayModal = useContext(ModalContext);
    const addTransaction = useContext(TransactionContext);
    const [submitting, setSubmitting] = useState(false);

    function addIdeaOnChain() {
        if ( idea === '' ) return;
        if ( submitting ) return;
        setSubmitting(true);

        const tx = contract.addIdea(boardID, idea, link, { gasLimit: 300000 });
        
        addTransaction({
            id: Date.now(),
            text: 'Your idea is being added. It may take a few minutes.',
            successText: 'Your idea has been added. Please refresh to continue.',
            failureText: 'There was a problem with adding your idea. Please try again.',
            promise: tx,
            next: () => displayModal({name: 'NO_MODAL'}),
        })
    }

    function handleChange(event) {
        setIdea(event.target.value)
    }

    function onCancel() {
        displayModal({
            name: 'NO_MODAL'
        });
    }

    return (
        <BaseModal disconnected={false}>
            <div className="font-bold text-2xl mb-4">
                Add Your Idea
            </div>
            <div className="mb-1">Idea Description: <span className='italic'>(in brief)</span></div>
            <textarea value={idea} placeholder="Explain your idea in brief" className="w-full h-64 border-solid border border-stone-600 mb-4 resize-none p-2" onChange={handleChange}></textarea>

            <div className="mb-1">Detailed Explanation: (if any)</div>
            <input type="text" value={link} placeholder="http://pastebin.com/XhxE" className="border-stone-600 border-solid border py-1 px-2 mb-4 w-full block" onChange={e => setLink(e.target.value)} />

            <PrimaryButton value="Add Your Idea" deactivated={submitting} onClick={addIdeaOnChain} />
            <SecondaryButton value="Back" onClick={onCancel} />
        </BaseModal>
    )
}

export default ProposalModal;