'use client'

import { useState } from 'react'
import Web3 from 'web3'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface AdminPageProps {
  web3: Web3 | null
  contract: any
  account: string
}

export default function AdminPageComponent({ web3, contract, account }: AdminPageProps) {
  const [userAddress, setUserAddress] = useState<string>('')
  const [newCreditScore, setNewCreditScore] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const updateCreditScore = async () => {
    if (contract && account) {
      setIsLoading(true)
      try {
        await contract.methods.updateCreditScoreParameters(userAddress, newCreditScore).send({ from: account })
        alert("Credit score updated successfully!")
      } catch (error) {
        console.error("Failed to update credit score:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center p-4">
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
        </CardContent>
        <CardFooter>
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
        </CardFooter>
      </Card>
    </div>
  )
}