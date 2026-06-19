# React Hook Form + Zod Rules

## 1. Schema-First Approach

Define Zod schema first, derive TypeScript type from it:

```typescript
import { z } from "zod";

const bookingSchema = z.object({
  hotelId: z.string().uuid(),
  checkIn: z.date({ required_error: "Check-in date is required" }),
  checkOut: z.date({ required_error: "Check-out date is required" }),
  guests: z.number().int().min(1).max(10),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number too short"),
  specialRequests: z.string().max(500).optional(),
}).refine(
  (data) => data.checkOut > data.checkIn,
  { message: "Check-out must be after check-in", path: ["checkOut"] }
);

type BookingFormValues = z.infer<typeof bookingSchema>;
```

## 2. Form Setup

```tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function BookingForm({ hotelId }: { hotelId: string }) {
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      hotelId,
      guests: 2,
      specialRequests: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    await mutation.mutateAsync(data);
  });

  return (
    <form onSubmit={onSubmit}>
      {/* Fields */}
    </form>
  );
}
```

## 3. FormField Pattern (with shadcn)

```tsx
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

<Form {...form}>
  <form onSubmit={onSubmit} className="space-y-4">
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input placeholder="you@example.com" {...field} />
          </FormControl>
          <FormMessage /> {/* Auto-displays Zod error */}
        </FormItem>
      )}
    />
  </form>
</Form>
```

## 4. Controlled Components (DatePicker, Select, etc.)

For components that don't use native input events:

```tsx
<FormField
  control={form.control}
  name="checkIn"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Check-in</FormLabel>
      <FormControl>
        <DatePicker
          value={field.value}
          onChange={field.onChange}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

## 5. Form Submission with Mutation

```tsx
const mutation = useMutation({
  mutationFn: submitBooking,
  onSuccess: () => {
    form.reset();
    toast.success("Booking submitted!");
  },
  onError: (error) => {
    // Map server errors to form fields if possible
    if (error.field) {
      form.setError(error.field, { message: error.message });
    } else {
      toast.error(error.message);
    }
  },
});

<Button type="submit" disabled={mutation.isPending}>
  {mutation.isPending ? "Submitting..." : "Submit"}
</Button>
```

## 6. Validation Rules

- ALL validation in Zod schema — not in HTML attributes or custom logic
- Show errors inline (next to the field) using `<FormMessage />`
- Validate on blur for UX (default in react-hook-form)
- Use `.refine()` for cross-field validation
- Use `.transform()` for data normalization before submission
