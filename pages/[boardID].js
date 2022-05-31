import Head from 'next/head'
import { useContext, useEffect, useState } from 'react';
import ModalContext from '../contexts/Modal'
import ContractContext from '../contexts/Contract'
import Cards from '../components/cards'
import PrimaryButton from '../components/button/Primary';
import Loader from '../components/loader';
import AdminSettings from '../components/admin';
import { useRouter } from 'next/router';

export default function BoardPage () {
    const displayModal = useContext(ModalContext);
    const { contract, signer } = useContext(ContractContext);
    const router = useRouter();
    const { boardID } = router.query;
    const [ board, setBoard ] = useState({});
    const [ canWrite, setCanWrite ] = useState(false);
    const [ canVote, setCanVote ] = useState(false);
    const [ ideas, setIdeas ] = useState([]);
    const [ showLoading, setShowLoading ] = useState(true);
    const [address, setAddress] = useState('');

    async function addIdea() {
        displayModal({
            name: 'NEW_IDEA_MODAL',
            boardID
        })
    }

    async function fetchDetails() {
        const _boards = await contract.getBoards();
        const _board = _boards[boardID];
        const _ideas = await contract.getIdeas(boardID);
        const _canWrite = await contract.canWrite(boardID);
        const _canVote = await contract.canVoteInBoard(boardID);
        const _address = await signer.getAddress();

        
        setAddress(_address);

        setIdeas(_ideas.map(idea => ({
            uid: idea.uid.toNumber(),
            boardID: idea.boardID.toNumber(),
            idea: idea.idea,
            link: idea.link,
            owner: idea.owner,
            votes: idea.votes.toNumber(),
            voted: false
        })))

        setBoard({
            name: _board.name,
            description: _board.description,
            voterGateToken: _board.voterGateToken,
            writerGateToken: _board.writerGateToken,
            admin: _board.admin,
            open: _board.open
        })

        setCanWrite(_canWrite);
        setCanVote(_canVote);

        setShowLoading(false);
    }

    useEffect(() => {
        if ( contract === undefined ) return;

        if ( contract === false ) {
            displayModal({name: 'INTRO_MODAL'});
        } else {
            fetchDetails();
        }
    }, [contract])

    return (
        <>
            <Head>
                <title>{showLoading ? "IdeaHunt" : `${board.name} - IdeaHunt`}</title>
            </Head>
            {
                showLoading ?
                <Loader className="w-16 h-16 mx-auto my-10" /> : 
                <>
                    <div className="font-bold text-3xl mb-3 flex items-center justify-between pr-2">
                        <div className="">
                            {board.name}
                        </div>
                        <AdminSettings board={board} boardID={boardID} setBoard={setBoard} />
                    </div>
                    <div className="mb-4">
                        {board.description}<br /><br />
                        {
                            board.open ?
                            (
                                <>
                                    {
                                        canWrite ?
                                        <>
                                            <i className="fa-solid fa-circle-check text-green-600 mr-2"></i> Add new ideas
                                        </> :
                                        <>
                                            <i className="fa-solid fa-circle-xmark text-red-600 mr-2"></i> Add new ideas
                                        </>
                                    }<br />
                                    {
                                        canVote ?
                                        <>
                                            <i className="fa-solid fa-circle-check text-green-600 mr-2"></i> Vote on ideas
                                        </> :
                                        <>
                                            <i className="fa-solid fa-circle-xmark text-red-600 mr-2"></i> Vote on ideas
                                        </>
                                    }
                                </>
                            ) :
                            <>
                                <i className="fa-solid fa-circle-exclamation text-blue-400"></i> This board has been closed by the admin.
                            </>
                        }
                    </div>
                    {
                        canWrite ?
                        <div className="w-80">
                            <PrimaryButton value="+ Add New Idea" onClick={addIdea} />
                        </div> :
                        <></>
                    }
                    <Cards cards={ideas} canVote={canVote} address={address} minimised={false} missingText="There are no ideas in this board." />
                </>
            }
        </>
    );
}