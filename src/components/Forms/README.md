# Forms

Documentation for our forms (which forms we have, and how they work).

## React-hook-form

We use [https://react-hook-form.com/](react-hook-form) for any forms which require clientside validation.

## Zod

We use zod (which we use already elsewhere) for validation schema. Below is an example of how we

```ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Defining schema for the form
const schema = z.object({
  email: z
    .string()
    .nonempty({
      message: "Email can't be empty",
    })
    .email({
      message: "Email not valid",
    }),
});

// Inferring types from schema
type NewsletterFormValues = z.infer<typeof schema>;

const MyForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    // Use inferred types here
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(schema),
    // mode: "onBlur" means that a user will be shown validation
    // errors as they are filling out the form.
    mode: "onBlur",
  });

  return (
    <form onSubmit={handleSubmit((d) => doSomething(d))}>
      <Input
        id="my-form-email"
        $mt={24}
        placeholder="Email"
        // passes necessary refs/handlers to input
        {...register("email")}
        // passes error to input
        error={errors.email?.message}
      />
    </form>
  );
};
```
