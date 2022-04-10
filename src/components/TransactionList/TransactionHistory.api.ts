import {api} from "../../api";
import {appConfig} from "../../config";
import {TON_ADDRESS} from "./TransactionList.constants";
import {GET_TRANSACTION_HISTORY_PARAMS, TransactionsHistoryRes} from "./TransactionList.interface";

/**
 @limit Maximum number of transactions in response.
 @it Logical time of transaction to start with, must be sent with hash.
 @hash Hash of transaction to start with, in base64 or hex encoding , must be sent with lt.
 @to_it Logical time of transaction to finish with (to get tx from lt to to_lt).
 @archival By default getTransaction request is processed by any available liteserver. If archival=true only liteservers with full history are used.
 */
export const fetchTransactionsHistory = ({
                                            limit = 10,
                                            it,
                                            hash,
                                            to_it = 0,
                                            archival = false
                                        }: GET_TRANSACTION_HISTORY_PARAMS) => api.get<TransactionsHistoryRes>(`${appConfig.apiUrl}getTransactions?address=${TON_ADDRESS}&limit=${limit}&to_lt=${to_it}&archival=${archival}`)