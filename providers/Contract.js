import ContractContext from '../contexts/Contract';
import { ethers } from "ethers";
import abi from '../config/abi.json'
import address from '../config/address'
import { useReducer, useEffect } from 'react'
import { checkEthereumConnection } from '../utils/utils'

function contractReducer(state, provider) {
    if ( provider === false ) {
        return { contract: false, provider: false, signer: false }
    }

    if ( provider.isConnected() ) {
        const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = ethersProvider.getSigner();
        const contract = new ethers.Contract(address, abi.abi, signer);

        return {contract, provider: ethersProvider, signer};
    }

    return state;
}

function ContractProvider({ children }) {
    const [{contract, provider, signer}, setProvider] = useReducer(contractReducer, {});

    async function setup() {
        if ( await checkEthereumConnection() === true ) {
            setProvider(window.ethereum);
        } else {
            setProvider(false);
        }
    }

    useEffect(() => {
        setup();
    }, [])

    return (
        <ContractContext.Provider value={{contract, provider, signer, setProvider}}>
            {children}
        </ContractContext.Provider>
    )
}

export default ContractProvider;