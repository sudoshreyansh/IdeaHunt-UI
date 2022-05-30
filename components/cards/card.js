import { useState, useContext } from "react";
import PrimaryButton from "../button/Primary";
import SecondaryButton from "../button/Secondary";
import ContractContext from "../../contexts/Contract";
import TransactionContext from "../../contexts/Transaction";

function Card({ uid, boardID, idea, link, owner, votes, canVote, ownIdea, castVote }) {
    const [voteDialog, setVoteDialog] = useState(false);
    const [casting, setCasting] = useState(false);
    const { contract } = useContext(ContractContext);
    const addTransaction = useContext(TransactionContext);

    function onVote() {
        if ( casting ) return;
        setCasting(true);

        const tx = contract.vote(boardID, uid, { gasLimit: 300000 });
        addTransaction({
            id: Date.now(),
            text: 'Your vote is being cast. It may take a few minutes.',
            successText: 'Your vote has been cast. Please refresh to continue.',
            failureText: 'There was a problem with casting your vote. Please try again.',
            promise: tx,
            next: () => setVoteDialog(false),
        })
    }

    return (
        <div className="rounded-md border-stone-600 border-solid border-2 p-3 w-full mb-5 md:mb-0 flex flex-col relative">
            <div className="font-bold mb-2">
                #{uid + 1}
            </div>
            <div className="mb-10 grow">
                <pre className="whitespace-pre-line mb-4">
                    {idea}
                </pre>
                { link === '' || link.slice(0, 4) !== 'http' ? '' : <a href={link} target="_blank" rel="noreferrer" className="underline">Read more here</a> }
            </div>
            <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-stone-500"></div>
                <div className="grow flex flex-col pl-4 font-semibold">
                    <div className="">{'0x' + owner.slice(2, 8).toUpperCase()}</div>
                    <div className="text-red-600 text-sm">{votes} Votes</div>
                </div>
                <i className={`fa-solid fa-heart text-3xl cursor-pointer ${canVote && !castVote && !ownIdea ? 'text-red-600' : 'text-red-800'} relative`} onClick={() => setVoteDialog(true)}>
                    {
                        voteDialog ?
                        (
                            canVote && !castVote && !ownIdea ?
                            <div className={`bg-white px-4 py-2 -left-2/3 top-full border-2 border-solid border-gray-600 bg-white z-10 text-black font-medium text-base w-60 rounded ${voteDialog ? 'absolute' : 'hidden'}`} onClick={e => e.stopPropagation()}>
                                <div>
                                    Do you want to vote for this idea?
                                </div>
                                <div className="flex text-sm mt-2">
                                    <PrimaryButton value="Yes" deactivated={casting} onClick={() => onVote(uid)} />
                                    <SecondaryButton value="No" onClick={() => setVoteDialog(false)} />
                                </div>
                            </div> :
                            <div className={`bg-white px-4 py-2 -left-2/3 top-full border-2 border-solid border-gray-600 bg-white z-10 text-black font-medium text-base w-60 rounded ${voteDialog ? 'absolute' : 'hidden'}`} onClick={e => e.stopPropagation()}>
                                <div>
                                    {
                                        ownIdea ? 'You cannot vote on your own idea.' : (
                                            castVote ? 'You can vote only once on an idea.' : 'You can\'t vote in this board.'
                                        )
                                    }
                                </div>
                                <div className="flex text-sm mt-2">
                                    <PrimaryButton value="OK" onClick={() => setVoteDialog(false)} />
                                </div>
                            </div>
                        ) :
                        <></>
                    }
                </i>
            </div>
        </div>
    )
}

export default Card;