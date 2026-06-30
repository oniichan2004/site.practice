import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {User} from "lucide-react"
export default function Register() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>  <User size={16} /> Register</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create an account</DialogTitle>
          <DialogDescription>
            Fill in your details to register.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="register-name" className="text-sm font-medium">
              Full name
            </label>
            <Input id="register-name" placeholder="John Doe" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="register-email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="register-email"
              type="email"
              placeholder="you@example.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="register-password" className="text-sm font-medium">
              Password
            </label>
            <Input id="register-password" type="password" placeholder="••••••••" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="register-confirm-password"
              className="text-sm font-medium"
            >
              Confirm password
            </label>
            <Input
              id="register-confirm-password"
              type="password"
              placeholder="••••••••"
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Register</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
