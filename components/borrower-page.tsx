'use client'

import { useState, useEffect } from 'react'
import Web3 from 'web3'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

interface BorrowerPageProps {
  web3: Web3 | null
  contract: any
  account: string
}

export default function BorrowerPageComponent({ web3, contract, account }: BorrowerPageProps) {
  const [userDetails, setUserDetails] = useState<any>(null)
  const [loanAmount, setLoanAmount] = useState<string>('')
  const [loanDuration, setLoanDuration] = useState<string>('')
  const [poolId, setPoolId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (contract && account) {
        try {
          const details = await contract.methods.getUserDetails(account).call()
          setUserDetails(details)
        } catch (error) {
          console.error("Failed to fetch user details:", error)
        }
      }
    }
    fetchUserDetails()
  }, [contract, account])

  const requestLoan = async () => {
    if (contract && account && web3) {
      setIsLoading(true)
      try {
        await contract.methods.requestLoan(poolId, web3.utils.toWei(loanAmount, 'ether'), loanDuration).send({ from: account })
        alert("Loan requested successfully!")
      } catch (error) {
        console.error("Failed to request loan:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-100 to-yellow-100 flex items-center justify-center p-4">
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
        </CardContent>
        <CardFooter>
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
        </CardFooter>
      </Card>
    </div>
  )
}