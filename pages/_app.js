import '../styles/globals.css'
import ContractProvider from '../providers/Contract'
import ModalProvider from '../providers/Modal'
import TransactionProvider from '../providers/Transaction'
import Header from '../components/header'
import Footer from '../components/footer'
import Body from '../components/body'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <script async src="https://kit.fontawesome.com/381c802c4a.js" crossOrigin="anonymous"></script>
            </Head>
            <ContractProvider>
                <TransactionProvider>
                    <ModalProvider>
                        <Header />
                        <Body>
                            <Component {...pageProps} />
                        </Body>
                        <Footer />
                    </ModalProvider>
                </TransactionProvider>
            </ContractProvider>
        </>
    )
}

export default MyApp
