'use client'

import { useState, useEffect } from 'react'
import Web3 from 'web3'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface LenderPageProps {
  web3: Web3 | null
  contract: any
  account: string
}

export default function LenderPageComponent({ web3, contract, account }: LenderPageProps) {
  const [maxLoanAmount, setMaxLoanAmount] = useState<string>('')
  const [interestRate, setInterestRate] = useState<string>('')
  const [minCreditScore, setMinCreditScore] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

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
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-blue-100 flex items-center justify-center p-4">
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
        </CardContent>
        <CardFooter>
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
        </CardFooter>
      </Card>
    </div>
  )
}