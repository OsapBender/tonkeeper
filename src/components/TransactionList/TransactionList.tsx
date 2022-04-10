import React, {useCallback, useEffect, useState} from 'react';
import styles from './TransactionList.module.css'
import sendIcon from '../../assets/icons/sendIcon.png'
import receiveIcon from '../../assets/icons/recieveIcon.png'
import {prepareAddress} from "./TransactionList.utils";
import {TransactionHistory} from "./TransactionList.interface";
import {fetchTransactionsHistory} from "./TransactionHistory.api";
import Loader from "../Loader";

const TransactionList = () => {
    const [transactions, setTransactions] = useState<TransactionHistory[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [modal, setModal] = useState({
        isShow: false,
        msg: ''
    })

    const onLoad = useCallback(() => {
        fetchTransactionsHistory({limit: transactions.length + 10}).then(res => {
            if (res.ok) {
                setTransactions(res.result)
                return setIsLoading(false)
            }
        }).catch(e => {
            setTimeout(onLoad, 1000)
        })
    }, [transactions.length])

    const onScroll = useCallback(() => {
        const {offsetHeight} = document.documentElement
        const {clientHeight} = document.documentElement
        const {scrollTop} = document.documentElement

        if (offsetHeight - clientHeight - scrollTop < 10 && !isLoading) {
            setIsLoading(true)

            onLoad()
        }
    }, [isLoading, onLoad])

    const onClick = (item: TransactionHistory) => {
        if (item.in_msg.message) {
            setModal({
                isShow: true,
                msg: item.in_msg.message
            })
        }
    }

    useEffect(() => {
        onLoad()
    }, [])

    useEffect(() => {
        window.addEventListener('scroll', onScroll)
        return () => {
            window.removeEventListener('scroll', onScroll)
        }
    }, [onScroll])

    if (!transactions) {
        return null
    }

    return (
        <div className={styles.Wrapper}>
            {/*{isShowModal && <Modal}*/}
            <ul className={styles.List}>
                {transactions.map(item => {
                    const destination = prepareAddress(item.in_msg.destination);
                    const source = prepareAddress(item.in_msg.source);
                    const isReceived = item.storage_fee === '0';
                    return (
                        <li className={styles.Item} key={item.transaction_id.hash} onClick={() => onClick(item)}>
                            <div className={styles.IconWrapper}>
                                {isReceived ? <img src={receiveIcon} alt="Send"/> : <img src={sendIcon} alt="Send"/>}
                            </div>
                            <div className={styles.Fact}>
                                <div className={styles.ItemHeader}>
                                    <div className={styles.StatusWrapper}>
                                        <span className={styles.Action}>{isReceived ? 'Received' : 'Sent'}</span>
                                        <span
                                            className={isReceived ? styles.SumReceived : styles.SumSent}>{isReceived ? '+' : '-'} {parseInt(item.fee).toLocaleString()} TON</span>
                                    </div>
                                    {isReceived ? (
                                        <div className={styles.ReceivedInfoTransaction}>
                                            <span>From</span>
                                            <span>{source}</span>
                                        </div>
                                    ) : (
                                        <div className={styles.SentInfoTransaction}>
                                            <div className={styles.SentInfoTransactionFact}>
                                                <span>Fee</span>
                                                <span>-{parseInt(item.storage_fee).toLocaleString()}</span>
                                            </div>
                                            <div className={styles.SentInfoTransactionFact}>
                                                <span>To</span>
                                                <span>{destination}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {
                                    item.in_msg.message && (
                                        <div className={styles.MsgWrapper}>
                                            <p className={styles.MsgContent}>
                                                {item.in_msg.message}
                                            </p>
                                        </div>
                                    )
                                }

                            </div>
                        </li>
                    )
                })}
            </ul>
            {isLoading && (
                <Loader/>
            )}
        </div>
    )
}

export default TransactionList