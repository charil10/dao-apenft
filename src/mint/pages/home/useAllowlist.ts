import { useContext, useMemo } from "react"
import { Web3Context } from "../../../share/context/web3-context"
import { MerkleTree } from "merkletreejs";
import { keccak256 } from "@ethersproject/keccak256";
import allowlist from "../../assets/whitelist.json";
const lowercaseAllowlist = allowlist.map((address) => address.toLowerCase())
const leafNodes = allowlist.map((addr) => keccak256(addr));
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

// console.log(allowlist);
// console.log('root', merkleTree.getHexRoot().toString());

const useAllowlist = () => {
  const { hex } = useContext(Web3Context)
  if (!hex) return {isAllowlist: false, proof: []}

  const accountSafe = `0x${hex.replace(/^41/, '')}`
  const isAllowlist = lowercaseAllowlist.includes(accountSafe)
  const leaf = keccak256(accountSafe);
  const proof = merkleTree.getProof(leaf).map(p => `0x${p.data.toString("hex")}`);
  // console.log(proof);
  return {isAllowlist, proof}
}

export default useAllowlist
