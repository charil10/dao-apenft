import {useCallback, useContext, useEffect, useImperativeHandle, useMemo, useState} from 'react'
import {Web3Context} from '../../../share/context/web3-context'
import './index.css'
import classNames from "classnames";
import {orderBy} from "lodash";
import {formatAddress} from "../../utils";

const pageSize = 100

function RankList(props: {
    onRef: any
}) {

    const [total, setTotal] = useState(0);
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);

    const {account, chainId, auction} = useContext(Web3Context)

    const load = async () => {

        setLoading(true);

        const total = (await auction.totalBider()).toString() * 1

        const page = Math.ceil(total / pageSize)

        let list = []

        for(let i =0 ;  i<  page; i++) {
            list = list.concat(
                await auction.page(i, pageSize)
            )
        }



        setList(
            orderBy(
                list.map((item) => {
                    return {
                        bider: item.bider.toLowerCase(),
                        count: item.burns.toString() * 1
                    }
                }),
                'count',
                'desc'
            ).slice(0, 50)
        );

        setTotal(total)

        setLoading(false);
    }

    useEffect(() => {
        load()
    }, [account, chainId])

    useImperativeHandle(props?.onRef, () => {
        return {
            load,
        };
    });


    return (
        <div className="ranklist">
            <h3>Burning Rank（1-50）：</h3>
            <div className="ranklist-content">
                {
                    list.map((item, index) => {
                        return <div key={index} className={classNames('rank-item', {
                            'rank-item-self': item.bider === account
                        })}>
                            <div className="rank-number">{index+1}</div>
                            <div className="rank-address">{formatAddress(item.bider)}</div>
                            <div className="rank-count">{item.count}</div>
                        </div>
                    })
                }
                {loading && <div className="loading">Loading....</div>}
            </div>
        </div>
    )

}

export default RankList