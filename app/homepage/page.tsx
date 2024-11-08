'use client'

import { useState, useEffect } from 'react'
import Web3 from 'web3'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import contractDetails from '../../components/contractDetails.json'

declare global {
  interface Window {
    ethereum: any;
  }
}

export default function Home() {
  const [web3, setWeb3] = useState<Web3 | null>(null)
  const [contract, setContract] = useState<any>(null)
  const [account, setAccount] = useState<string>('')
  const [accountType, setAccountType] = useState<string>('')
  const [userDetails, setUserDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Borrower state
  const [loanAmount, setLoanAmount] = useState<string>('')
  const [loanDuration, setLoanDuration] = useState<string>('')
  const [poolId, setPoolId] = useState<string>('')

  // Lender state
  const [maxLoanAmount, setMaxLoanAmount] = useState<string>('')
  const [interestRate, setInterestRate] = useState<string>('')
  const [minCreditScore, setMinCreditScore] = useState<string>('')

  // Admin state
  const [userAddress, setUserAddress] = useState<string>('')
  const [newCreditScore, setNewCreditScore] = useState<string>('')

  useEffect(() => {
    const initWeb3 = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
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
          setUserDetails(userDetails)
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

  const requestLoan = async () => {
    if (contract && account && web3) {
      setIsLoading(true)
      try {
        await contract.methods.requestLoan(poolId, web3.utils.toWei(loanAmount, 'ether'), loanDuration).send({ from: account })
        alert("Loan requested successfully!")
      } catch (error) {
        console.error("Failed to request loan:", error)
        alert("Failed to request loan")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const createLendingPool = async () => {
    if (contract && account && web3) {
      setIsLoading(true)
      try {
        await contract.methods.createLendingPool(
          web3.utils.toWei(maxLoanAmount, 'ether'),
          web3.utils.toWei(interestRate, 'ether'),
          minCreditScore
        ).send({ from: account })
        alert("Lending pool created successfully!")
      } catch (error) {
        console.error("Failed to create lending pool:", error)
        alert("Failed to create lending pool")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const updateCreditScore = async () => {
    if (contract && account) {
      setIsLoading(true)
      try {
        await contract.methods.updateCreditScoreParameters(userAddress, newCreditScore).send({ from: account })
        alert("Credit score updated successfully!")
      } catch (error) {
        console.error("Failed to update credit score:", error)
        alert("Failed to update credit score")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const renderContent = () => {
    if (!account) {
      return (
        <Card className="w-full max-w-md mx-auto border-2 border-orange-500">
          <CardHeader className="bg-orange-500 text-white">
            <CardTitle className="text-2xl font-bold">MicroLending Platform</CardTitle>
            <CardDescription className="text-orange-100">Empowering Rural India</CardDescription>
          </CardHeader>
          <CardContent className="mt-4 space-y-4">
            <p className="text-center text-gray-700">Connect your wallet to get started</p>
            <Button onClick={connectWallet} className="w-full bg-green-600 hover:bg-green-700">
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      )
    }

    switch (accountType) {
      case 'Borrower':
        return (
          <Card className="w-full max-w-md mx-auto border-2 border-orange-500">
            <CardHeader className="bg-orange-500 text-white">
              <CardTitle className="text-2xl font-bold">Borrower Dashboard</CardTitle>
              <CardDescription className="text-orange-100">Request a Loan</CardDescription>
            </CardHeader>
            <CardContent className="mt-4 space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-inner space-y-2">
                <p className="text-lg font-semibold text-orange-800">{userDetails?.name}</p>
                <p className="text-sm text-gray-600">Credit Score: {userDetails?.creditScore}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">SHG Member:</span>
                  {userDetails?.isSHGMember ? (
                    <Badge className="bg-green-500">Yes</Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-500 border-red-500">No</Badge>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="poolId" className="text-orange-800">Pool ID</Label>
                <Input id="poolId" value={poolId} onChange={(e) => setPoolId(e.target.value)} placeholder="Enter Pool ID" className="border-orange-300 focus:border-orange-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loanAmount" className="text-orange-800">Loan Amount (ETH)</Label>
                <Input id="loanAmount" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} placeholder="Enter loan amount" className="border-orange-300 focus:border-orange-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loanDuration" className="text-orange-800">Loan Duration (days)</Label>
                <Input id="loanDuration" value={loanDuration} onChange={(e) => setLoanDuration(e.target.value)} placeholder="Enter loan duration" className="border-orange-300 focus:border-orange-500" />
              </div>
              <Button onClick={requestLoan} className="w-full bg-orange-600 hover:bg-orange-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Requesting...
                  </>
                ) : (
                  'Request Loan'
                )}
              </Button>
            </CardContent>
          </Card>
        )
      case 'Lender':
        return (
          <Card className="w-full max-w-md mx-auto border-2 border-green-500">
            <CardHeader className="bg-green-500 text-white">
              <CardTitle className="text-2xl font-bold">Lender Dashboard</CardTitle>
              <CardDescription className="text-green-100">Create a Lending Pool</CardDescription>
            </CardHeader>
            <CardContent className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="maxLoanAmount" className="text-green-800">Max Loan Amount (ETH)</Label>
                <Input id="maxLoanAmount" value={maxLoanAmount} onChange={(e) => setMaxLoanAmount(e.target.value)} placeholder="Enter max loan amount" className="border-green-300 focus:border-green-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="interestRate" className="text-green-800">Interest Rate (%)</Label>
                <Input id="interestRate" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} placeholder="Enter interest rate" className="border-green-300 focus:border-green-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minCreditScore" className="text-green-800">Minimum Credit Score</Label>
                <Input id="minCreditScore" value={minCreditScore} onChange={(e) => setMinCreditScore(e.target.value)} placeholder="Enter minimum credit score" className="border-green-300 focus:border-green-500" />
              </div>
              <Button onClick={createLendingPool} className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Pool...
                  </>
                ) : (
                  'Create Lending Pool'
                )}
              </Button>
            </CardContent>
          </Card>
        )
      case 'Admin':
        return (
          <Card className="w-full max-w-md mx-auto border-2 border-purple-500">
            <CardHeader className="bg-purple-500 text-white">
              <CardTitle className="text-2xl font-bold">Admin Dashboard</CardTitle>
              <CardDescription className="text-purple-100">Manage User Credit Scores</CardDescription>
            </CardHeader>
            <CardContent className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userAddress" className="text-purple-800">User Address</Label>
                <Input id="userAddress" value={userAddress} onChange={(e) => setUserAddress(e.target.value)} placeholder="Enter user address" className="border-purple-300 focus:border-purple-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newCreditScore" className="text-purple-800">New Credit Score</Label>
                <Input id="newCreditScore" value={newCreditScore} onChange={(e) => setNewCreditScore(e.target.value)} placeholder="Enter new credit score" className="border-purple-300 focus:border-purple-500" />
              </div>
              <Button onClick={updateCreditScore} className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Credit Score'
                )}
              </Button>
            </CardContent>
          </Card>
        )
      default:
        return (
          <Card className="w-full max-w-md mx-auto border-2 border-orange-500">
            <CardHeader className="bg-orange-500 text-white">
              <CardTitle className="text-2xl font-bold">MicroLending Platform</CardTitle>
              <CardDescription className="text-orange-100">Empowering Rural India</CardDescription>
            </CardHeader>
            <CardContent className="mt-4 space-y-4">
              <p className="text-center text-gray-700">Please register as a borrower or lender to continue.</p>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-100 to-yellow-100 flex items-center justify-center p-4">
      {renderContent()}
    </div>
  )
}