# Form Patterns

## Metadata

- **triggers**: form, validation, multi-step, upload, field array, zod schema
- **priority**: 2
- **context**: react-hook-form, zod
- **conflicts**: none

## When to Activate

- Building complex multi-step forms
- Implementing dynamic form fields (add/remove)
- Handling file uploads
- Complex validation scenarios (cross-field, async)
- Form arrays and nested objects

## Multi-Step Form

```tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Step schemas
const step1Schema = z.object({
  destination: z.string().min(1),
  dates: z.object({ checkIn: z.date(), checkOut: z.date() }),
});

const step2Schema = z.object({
  guests: z.number().int().min(1).max(10),
  rooms: z.number().int().min(1).max(5),
});

const step3Schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
});

const fullSchema = step1Schema.merge(step2Schema).merge(step3Schema);
type FormValues = z.infer<typeof fullSchema>;

const schemas = [step1Schema, step2Schema, step3Schema];

function MultiStepBookingForm() {
  const [step, setStep] = useState(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(schemas[step]),
    mode: "onBlur",
  });

  const onNext = form.handleSubmit(() => {
    if (step < schemas.length - 1) {
      setStep((s) => s + 1);
    } else {
      // Submit
      mutation.mutate(form.getValues());
    }
  });

  const onBack = () => setStep((s) => Math.max(0, s - 1));

  return (
    <Form {...form}>
      <form onSubmit={onNext}>
        {step === 0 && <Step1Fields form={form} />}
        {step === 1 && <Step2Fields form={form} />}
        {step === 2 && <Step3Fields form={form} />}

        <div className="flex justify-between mt-4">
          {step > 0 && (
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
          )}
          <Button type="submit">
            {step === schemas.length - 1 ? "Submit" : "Next"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

## Dynamic Field Arrays

```tsx
import { useFieldArray } from "react-hook-form";

const schema = z.object({
  travelers: z
    .array(
      z.object({
        name: z.string().min(2),
        age: z.number().int().min(0).max(120),
        passport: z.string().optional(),
      }),
    )
    .min(1, "At least one traveler required"),
});

function TravelersForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { travelers: [{ name: "", age: 0 }] },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "travelers",
  });

  return (
    <>
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2 items-end">
          <FormField
            control={form.control}
            name={`travelers.${index}.name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`travelers.${index}.age`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(+e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {fields.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => append({ name: "", age: 0 })}
      >
        Add Traveler
      </Button>
    </>
  );
}
```

## Async Validation

```typescript
const schema = z.object({
  email: z
    .string()
    .email()
    .refine(
      async (email) => {
        const exists = await checkEmailExists(email);
        return !exists;
      },
      { message: "This email is already registered" },
    ),
});
```

## File Upload with react-dropzone

```tsx
import { useDropzone } from "react-dropzone";

function FileUploadField({
  onChange,
  value,
}: {
  onChange: (files: File[]) => void;
  value: File[];
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 5,
    onDrop: (accepted) => onChange([...value, ...accepted]),
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
        isDragActive
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50",
      )}
    >
      <input {...getInputProps()} />
      <p>
        {isDragActive ? "Drop files here" : "Drag & drop or click to upload"}
      </p>
    </div>
  );
}
```
