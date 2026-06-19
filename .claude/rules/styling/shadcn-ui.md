# shadcn/ui Rules

## 1. Use shadcn Components First

Before creating a custom component, check if shadcn/ui has one:

```tsx
// ✅ Correct — use shadcn
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ❌ Wrong — custom implementation when shadcn has it
<div className="modal-overlay">
  <div className="modal-content">...</div>
</div>;
```

## 2. Extending Components with CVA

Use `class-variance-authority` (CVA) for variant-based components:

```tsx
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        outline: "border border-border text-foreground",
        destructive: "bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface BadgeProps
  extends React.ComponentProps<"div">, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
```

## 3. Slot Pattern (asChild)

When a component needs to render as a different element:

```tsx
import { Slot } from "@radix-ui/react-slot";

interface ButtonProps extends React.ComponentProps<"button"> {
  asChild?: boolean;
}

function Button({ asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp {...props} />;
}

// Usage — Button renders as Link
<Button asChild>
  <Link href="/hotels">View Hotels</Link>
</Button>;
```

## 4. Component Discovery

Before building something custom, check the shadcn registry:

- **Accordion** — collapsible sections
- **Alert / AlertDialog** — messages and confirmations
- **Avatar** — user images
- **Badge** — status labels
- **Button** — actions
- **Calendar / DatePicker** — date selection
- **Card** — content containers
- **Carousel** — sliding content
- **Checkbox / RadioGroup** — selection controls
- **Combobox (Popover + Command)** — searchable select
- **Dialog / Sheet / Drawer** — overlays
- **DropdownMenu** — action menus
- **Form** — react-hook-form integration
- **Input / Textarea** — text fields
- **Popover / Tooltip** — floating content
- **Select** — dropdown selection
- **Separator** — dividers
- **Skeleton** — loading placeholders
- **Slider** — range input
- **Switch / Toggle** — boolean controls
- **Table** — data display
- **Tabs** — tabbed content

## 5. Customization Rules

- Customize via `className` prop — never modify the source component
- Override colors using theme CSS variables, not hardcoded values
- If you need a significantly different component, create a new one — don't force-fit shadcn

```tsx
// ✅ Correct — customize via className
<Button className="w-full rounded-full" variant="outline">
  Book Now
</Button>

// ❌ Wrong — modifying shadcn source
// Don't edit components/ui/button.tsx directly for project-specific styling
```
