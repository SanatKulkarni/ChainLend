'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface HomePageProps {
  connectWallet: () => Promise<void>
}

export default function HomePageComponent({ connectWallet }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-100 to-yellow-100 flex items-center justify-center p-4">
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
    </div>
  )
}