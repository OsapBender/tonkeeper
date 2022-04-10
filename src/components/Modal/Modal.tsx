import React, {useCallback, useRef, useState} from 'react';
import styles from './Modal.module.css'
import {COMMENTS} from "../TransactionList/TransactionList.constants";

interface IProps {
    message: string
    hash: string
    onClose: () => void
}

/**
 @msg комментарий к записи
 @hash уникальный идентификатор для лс
 @onClose callback для закрытия
 */
const Modal = ({message, hash, onClose}: IProps) => {
    const [msg, setMsg] = useState(message)
    const [error, setError] = useState('')
    const ref = useRef(null)

    const onInput = (e: { target: { innerText: string }; }) => {
        const val = e.target.innerText
        if (!val) {
            setError('You must leave at least one character')
        } else {
            setError('')
        }
        setMsg(val)
    }

    const onSave = useCallback(() => {
        if (error) {
            return
        }
        const data = window.localStorage.getItem(COMMENTS)

        if (!data) {
            window.localStorage.setItem(COMMENTS, JSON.stringify({[hash]: msg}))
            return onClose()
        }

        window.localStorage.setItem(COMMENTS, JSON.stringify({...JSON.parse(data), [hash]: msg}))

        onClose()
    }, [error, hash, msg, onClose])

    const onClickOutside = (e: {target: EventTarget}) => {
        if (ref && ref.current && ref.current === e.target) {
            onClose()
        }
    }

    return (
        <div className={styles.ModalWrapper} ref={ref} onClick={onClickOutside}>
            <div className={styles.ModalContainer}>
                {error && <p className={styles.Error}>{error}</p>}
                {/*@ts-ignore*/}
                <div className={styles.Input} onInput={onInput} suppressContentEditableWarning contentEditable
                     dir="auto">
                    {message}
                </div>
                <div className={styles.btnWrapper}>
                    <button className={styles.Btn} type="button" onClick={onSave} disabled={!!error}>Save</button>
                    <button className={styles.Btn} type="button" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    )
}

export default Modal