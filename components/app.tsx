'use client'

import { useState, useEffect } from 'react'
import Web3 from 'web3'
import contractDetails from './contractDetails.json'
import HomePageComponent from './home-page'
import BorrowerPageComponent from './borrower-page'
import LenderPageComponent from './lender-page'
import AdminPageComponent from './admin-page'

declare global {
  interface Window {
    ethereum: any;
  }
}

export function AppComponent() {
  const [web3, setWeb3] = useState<Web3 | null>(null)
  const [contract, setContract] = useState<any>(null)
  const [account, setAccount] = useState<string>('')
  const [accountType, setAccountType] = useState<string>('')

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum)
        setWeb3(web3Instance)
        const contractInstance = new web3Instance.eth.Contract(
          contractDetails.abi,
          contractDetails.address
        )
        setContract(contractInstance)
      }
    }
    initWeb3()
  }, [])

  const connectWallet = async () => {
    if (web3) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        setAccount(accounts[0])
        await determineAccountType(accounts[0])
      } catch (error) {
        console.error("Failed to connect wallet:", error)
      }
    }
  }

  const determineAccountType = async (address: string) => {
    if (contract) {
      try {
        const owner = await contract.methods.owner().call()
        if (address.toLowerCase() === owner.toLowerCase()) {
          setAccountType('Admin')
        } else {
          const userDetails = await contract.methods.getUserDetails(address).call()
          if (userDetails.name !== '') {
            const lenderPools = await contract.methods.lenderPools(address).call()
            setAccountType(lenderPools.length > 0 ? 'Lender' : 'Borrower')
          } else {
            setAccountType('Guest')
          }
        }
      } catch (error) {
        console.error("Failed to determine account type:", error)
        setAccountType('Guest')
      }
    }
  }

  if (!account) {
    return <HomePageComponent connectWallet={connectWallet} />
  }

  switch (accountType) {
    case 'Borrower':
      return <BorrowerPageComponent web3={web3} contract={contract} account={account} />
    case 'Lender':
      return <LenderPageComponent web3={web3} contract={contract} account={account} />
    case 'Admin':
      return <AdminPageComponent web3={web3} contract={contract} account={account} />
    default:
      return <HomePageComponent connectWallet={connectWallet} />
  }
}