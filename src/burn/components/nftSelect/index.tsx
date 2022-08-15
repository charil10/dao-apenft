import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Web3Context } from '../../../share/context/web3-context'
import Button from '../button'
import './index.css'
import classNames from "classnames";


function NftSelect(props: {
  visible: boolean,
  onCancel: () => void
  onSuccess: () => void
}) {
  const {account, nft, auction} = useContext(Web3Context)

  const [loading, setLoading] = useState<boolean>(true)
  const [nftIds, setNftIds] = useState<Array<number>>([])

  useEffect(() => {
    console.log(account)
    if (!account) return
    nft.tokensOfOwner(account).then(ids => {
      setNftIds(ids.map(id => id.toNumber()))
      setLoading(false)
    })
  }, [account])

  const [selectedNftIds, setSelectNftIds] = useState<Array<number>>([])

  const selectId = id => setSelectNftIds(ids => [...ids, id])

  const unselectId = id => setSelectNftIds(ids => ids.filter(i => i !== id))

  const unselectedNftIfs = useMemo(() => nftIds.filter(id => !selectedNftIds.includes(id)), [nftIds, selectedNftIds])

  const cancel = () => {
    setSelectNftIds([])
    props?.onCancel()
  }
  
  const burn = useCallback(
    async () => {
      if(loading) {
        return false
      }
      try {
        const tx = await auction.bid(selectedNftIds)
        setLoading(true)
        await tx.wait()
        props?.onSuccess()
      } catch (e) {
        console.log(e);
      }
      setLoading(false)
    },
    [account, selectedNftIds])

  return <div className={classNames('nft-select-box-container', {
    'visible': props.visible
  })}>
    <div className="nft-select-box">
      <div className='id-selection'>
        <div className='unselected'>
          {unselectedNftIfs.map(id => <span className='unselectedItem' key={id} onClick={() => selectId(id)}>#{id}</span>)}
        </div>
        <div className='selected'>
          {selectedNftIds.map(id => <span className='selectedItem' key={id}>#{id}<i onClick={() => unselectId(id)} className='deleteSelectedItem'/></span>)}
        </div>
      </div>
      <div className="select-actions">
        <Button size="XS" outlined onClick={cancel}>Cancel</Button>
        <Button size="XS" onClick={burn} disabled={loading}>
          {loading ? 'Burning...' : 'Burn'}
        </Button>
      </div>
    </div>
  </div>
  
}

export default NftSelect