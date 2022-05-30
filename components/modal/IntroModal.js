import BaseModal from './BaseModal'
import PrimaryButton from '../button/Primary';
import ModalContext from '../../contexts/Modal';
import { useContext, useEffect, useState } from 'react';
import ContractContext from '../../contexts/Contract';

function IntroContents({ next }) {
    return (
        <>
            <div className="font-bold mb-5 text-2xl">
                Hold Up!
            </div>
            <div className="font-bold mb-2 text-xl">
                A word about IdeaHunt
            </div>
            <div className="mb-6 text-sm">
                <i className="fa-solid fa-circle-check text-green-700 mr-2"></i> Share and vote on ideas on the Boards.<br />
                <i className="fa-solid fa-circle-check text-green-700 mr-2"></i> Create Idea Boards for different topics and purposes.<br />
                <i className="fa-solid fa-circle-check text-green-700 mr-2"></i> Restrict access to Boards using in-house Hunter NFT or any external NFT.<br />
                <i className="fa-solid fa-circle-check text-green-700 mr-2"></i> Add more detailed ideas through external links.<br />
                <i className="fa-solid fa-circle-check text-green-700 mr-2"></i> Bounty Boards to encourage ideas with a Prize (Upcoming)<br />
            </div>
            <div className="text-sm">
                <PrimaryButton value="Continue" onClick={next} />
            </div>
        </>
    )
}

function Web3Connect({ next }) {
    const [wallet, setWallet] = useState();
    const approved = wallet && wallet.chain === '0x4';

    async function connectWallet() {
        try {
            const _wallet = {};
            if ( window.ethereum ) {
                _wallet.provider = window.ethereum;
                const accounts = await _wallet.provider.request({ method: 'eth_requestAccounts' });
                _wallet.account = accounts[0];
                _wallet.chain = await _wallet.provider.request({ method: 'eth_chainId' });

                setWallet(_wallet);
            }
        } catch (e) {}
    }

    useEffect(() => {
        if ( !wallet ) {
            connectWallet();
        }
    }, [wallet])

    return (
        <>
            <div className="font-bold mb-5 text-2xl">
                One Last Thing!
            </div>
            <div className="font-bold mb-2 text-xl">
                Connect Your Metamask Wallet (Rinkeby Chain)
            </div>
            <div className="mb-6 text-sm flex rounded-md p-2 items-center">
                <img src="https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg" alt="Metamask Logo" className="block w-16" />
                <div className="pl-6 py-2 grow">
                    {
                        approved ?
                        <>
                            <div className="font-semibold">
                                {wallet.account}
                            </div>
                            <div className="text-sm">
                                Rinkeby Network
                            </div>
                        </> :
                        (
                            wallet ?
                            <>
                                <div className="font-semibold">
                                    {wallet.account}
                                </div>
                                <div className="text-sm">
                                    Unknown Network
                                </div>
                            </> :
                            <div className="font-semibold pb-6">
                                Not Connected
                            </div>
                        )
                    }
                </div>
                <div className="text-2xl pr-4">
                    { 
                        approved ? 
                        <i className="fa-solid fa-circle-check text-green-700"></i> :  
                        <i className="fa-solid fa-circle-xmark text-red-700"></i>
                    }
                </div>
            </div>
            <div className="text-sm">
                {
                    approved ?
                    <PrimaryButton value="Finish Setup" onClick={() => next(wallet.provider)} /> :
                    <PrimaryButton value="Connect to IdeaHunt" onClick={connectWallet} />
                }
            </div>
        </>
    )
}

function IntroModal() {
    const displayModal = useContext(ModalContext);
    const { setProvider } = useContext(ContractContext);
    const [pageIndex, setPageIndex] = useState(0);

    function updateWeb3Contract(provider) {
        displayModal({name: 'NO_MODAL'});
        setProvider(provider);
    }

    const IntroFlow = [
        <IntroContents key="intro-content" next={() => setPageIndex(1)} />,
        <Web3Connect key="wallet-connect" next={updateWeb3Contract} />
    ]

    const contents = IntroFlow[pageIndex];

    return (
        <BaseModal disconnected={true}>
            {contents}
        </BaseModal>
    )
}

export default IntroModal;