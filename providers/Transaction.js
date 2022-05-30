import { useReducer } from 'react';
import TransactionContext from '../contexts/Transaction';
import Notification from '../components/notification';

function TransactionProvider({ children }) {
    const [notifications, setTransactions] = useReducer(reducer, {});

    function reducer(state, action) {
        if ( typeof action === 'number' || typeof action === 'string' ) {
            const _state = {...state};
            delete _state[action];
            return _state;
        }

        if ( action.promise ) {
            action.promise.then(tx => {
                setTransactions({
                    id: action.id,
                    text: action.text
                });
                action.next();
                return tx.wait();
            }).then(() => {
               setTransactions({
                   id: Date.now(),
                   text: action.successText
               });
           }).catch(e => {
               console.log(e);
               action.next();
               setTransactions({
                   id: Date.now(),
                   text: action.failureText
               });
           })

           return state;
        }
    
        return {
            ...state,
            [action.id]: action.text,
        };
    }

    return (
        <TransactionContext.Provider value={setTransactions}>
            {children}
            <div className="fixed right-0 bottom-0 pr-10 pb-10 transition-all">
            {
                Object.keys(notifications).map(id => (
                    <Notification key={id} text={notifications[id]} onClick={() => setTransactions(id)} />
                ))
            }
            </div>
        </TransactionContext.Provider>
    )
}

export default TransactionProvider;