'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Box, Lock, Mail } from "lucide-react"
import { sendPasswordResetEmailFirebase, signInWithEmailAndPasswordFirebase } from '@/firebase/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const user = await signInWithEmailAndPasswordFirebase(email, password)
      router.push('/homepage') // Redirect to homepage on successful login
    } catch (error) {
      console.error('Login failed:', error)
      toast({
        title: "Inloggning misslyckades",
        description: "Kontrollera dina uppgifter och försök igen.",
      })
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await sendPasswordResetEmailFirebase(forgotEmail)

      setIsDialogOpen(false)
      setForgotEmail('')

      // Show toast notification
      toast({
        title: "Återställningslänk skickad",
        description: `En länk för att återställa lösenordet har skickats till ${forgotEmail}`,
      })
    } catch (error) {
      console.error('Error sending password reset email:', error)
      toast({
        title: "Fel vid återställning",
        description: "Kunde inte skicka återställningslänk. Kontrollera e-postadressen och försök igen.",
      })
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 space-y-6">
          <div className="flex flex-col items-center space-y-2">
            <Box className="h-12 w-12 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-900">Förråds Organiserare</h1>
            <p className="text-gray-500">Logga in för att organisera ditt förråd</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                E-postadress
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="namn@exempel.se"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Lösenord
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm text-gray-600">
                  Kom ihåg mig
                </Label>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="link" className="text-sm text-blue-600 hover:underline p-0">
                    Glömt lösenord?
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Återställ lösenord</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="forgot-email" className="text-sm font-medium text-gray-700">
                        E-postadress
                      </Label>
                      <Input
                        id="forgot-email"
                        type="email"
                        placeholder="namn@exempel.se"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Skicka återställningslänk
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Button type="submit" className="w-full">
              Logga in
            </Button>
          </form>
        </div>
      </div>
      <Toaster />
    </>
  )
}