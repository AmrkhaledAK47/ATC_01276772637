
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { CheckCircle, Send } from "lucide-react"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      toast.success("Thank you for subscribing!")
      
      // Reset after a while
      setTimeout(() => {
        setEmail("")
        setIsSubmitted(false)
      }, 3000)
    }, 1500)
  }
  
  return (
    <div className="neumorphic-card p-8 w-full">
      <h3 className="text-xl md:text-2xl mb-4 text-center">Subscribe to our newsletter</h3>
      <p className="text-muted-foreground mb-6 text-center">Get the latest updates on new events and special offers</p>
      
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting || isSubmitted}
            className={`h-12 pl-4 pr-4 w-full rounded-md transition-all duration-300 ${
              isSubmitted ? 'bg-success/10 border-success' : ''
            }`}
          />
          {isSubmitted && (
            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-success h-5 w-5" />
          )}
        </div>
        
        <Button 
          type="submit" 
          disabled={isSubmitting || isSubmitted}
          className={`h-12 px-6 flex items-center gap-2 transition-all duration-300 ${
            isSubmitting ? 'animate-pulse' : ''
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Subscribing...</span>
            </>
          ) : isSubmitted ? (
            <>
              <CheckCircle className="h-5 w-5" />
              <span>Subscribed</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Subscribe</span>
            </>
          )}
        </Button>
      </form>
      
      <p className="text-xs text-muted-foreground mt-4 text-center">
        By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
      </p>
    </div>
  )
}
