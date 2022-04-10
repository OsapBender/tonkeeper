import React, {useEffect, useState} from 'react';
import styles from './Loader.module.css'

const Loader = () => {
    const [dots, setDots] = useState('.')
    useEffect(() => {
        const interval = setInterval(() => {
            if (dots.length === 3) {
                return setDots('.')
            }

            if (dots.length === 2) {
                return setDots('...')
            }

            return setDots('..')
        }, 400)
        return () => {
            clearInterval(interval)
        }
    }, [dots])

    return (
        <div className={styles.Wrapper}>
            <span className={styles.Content}>Загрузка{dots}</span>
        </div>
    )
}

export default Loader