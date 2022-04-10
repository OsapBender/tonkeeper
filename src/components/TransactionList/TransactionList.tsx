import React, {useCallback, useEffect, useState} from 'react';
import cx from 'classnames'
import styles from './TransactionList.module.css'
import sendIcon from '../../assets/icons/sendIcon.png'
import receiveIcon from '../../assets/icons/recieveIcon.png'
import {prepareAddress} from "./TransactionList.utils";
import {TransactionHistory} from "./TransactionList.interface";
import {fetchTransactionsHistory} from "./TransactionHistory.api";
import Loader from "../Loader";
import Modal from "../Modal";
import {COMMENTS, ZERO_STORAGE_FEE} from "./TransactionList.constants";

const TransactionList = () => {
    const [transactions, setTransactions] = useState<TransactionHistory[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [modal, setModal] = useState({
        isShow: false,
        msg: '',
        hash: ''
    })

    const onCloseModal = () => {
        setModal({
            isShow: false,
            msg: '',
            hash: ''
        })
    }

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

    const onEditMsg = (item: TransactionHistory, msg: string | null) => {
        if (item.in_msg.message) {
            setModal({
                isShow: true,
                msg: msg ? msg : item.in_msg.message,
                hash: item.transaction_id.hash
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
            {modal.isShow && <Modal message={modal.msg} hash={modal.hash} onClose={onCloseModal}/>}
            <ul className={styles.List}>
                {transactions.map(item => {
                    const destination = prepareAddress(item.in_msg.destination);
                    const source = prepareAddress(item.in_msg.source);
                    const isReceived = item.storage_fee === ZERO_STORAGE_FEE;

                    const msg = window.localStorage.getItem(COMMENTS) ? JSON.parse(window.localStorage.getItem(COMMENTS) as string)[item.transaction_id.hash] : null

                    return (
                        <li className={cx(styles.Item, {[styles.ClickableItem]: msg || item.in_msg.message})}
                            key={item.transaction_id.hash} onClick={() => onEditMsg(item, msg)}>
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
                                        <div
                                            className={isReceived ? cx(styles.MsgWrapper, styles.MsgWrapperReceived) : cx(styles.MsgWrapper, styles.MsgWrapperSent)}>
                                            <p className={styles.MsgContent}>
                                                {msg ? msg : item.in_msg.message}
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