import {z} from "zod";

export const createFormSchema = (
    countries: string[]
) =>
    z
        .object({
            name: z
                .string()
                .trim()
                .min(
                    1,
                    "Name is required"
                )
                .refine(
                    (value) =>
                        value[0] ===
                        value[0]?.toUpperCase(),
                    {
                        message:
                            "First letter must be uppercase",
                    }
                ),

            age: z.coerce
                .number({
                    message:
                        "Age must be a number",
                })
                .min(
                    0,
                    "Age cannot be negative"
                ),

            email: z
                .string()
                .trim()
                .min(
                    1,
                    "Email is required"
                )
                .refine((email) => {
                    const parts =
                        email.split("@");

                    if (parts.length !== 2)
                        return false;

                    const [local, domain] =
                        parts;

                    if (!local.length)
                        return false;

                    if (!domain.length)
                        return false;

                    return domain.includes(".");
                }, {
                    message:
                        "Please enter a valid email",
                }),

            password: z
                .string()
                .min(
                    8,
                    "Password must contain at least 8 characters"
                ),

            // confirmPassword:
            //     z.string(),

            gender: z
                .string()
                .min(
                    1,
                    "Gender is required"
                ),

            country: z
                .string()
                .refine(
                    (country) =>
                        countries.includes(
                            country
                        ),
                    {
                        message:
                            "Country must exist in the countries list",
                    }
                ),

            terms: z.literal(true, {
                message:
                    "You must accept Terms & Conditions",
            }),
        });
        // .superRefine(
        //     (data, ctx) => {
        //         if (
        //             data.password !==
        //             data.confirmPassword
        //         ) {
        //             ctx.addIssue({
        //                 code: z.ZodIssueCode.custom,
        //                 path: [
        //                     "confirmPassword",
        //                 ],
        //                 message:
        //                     "Passwords must match",
        //             });
        //         }
        //     }
        // );