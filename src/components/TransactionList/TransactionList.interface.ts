export interface GET_TRANSACTION_HISTORY_PARAMS {
    limit?: number
    it?: number
    hash?: string
    to_it?: number
    archival?: boolean
}

export interface TransactionHistory {
    "@type": "raw.transaction",
    "utime": number,
    "data": string,
    "transaction_id": {
        "@type": string,
        "lt": string,
        "hash": string
    },
    "fee": string,
    "storage_fee": string,
    "other_fee": string,
    "in_msg": {
        "@type": "raw.message",
        "source": string,
        "destination": string
        "value": string
        "fwd_fee": string
        "ihr_fee": string
        "created_lt": string
        "body_hash": string
        "msg_data": {
            "@type": "msg.dataRaw",
            "body": string
            "init_state": string
        },
        "message": string
    },
    "out_msgs": []
}


export interface TransactionsHistoryRes {
    result: TransactionHistory[]
    ok: boolean
}