import {FormEvent, useState} from "react";
import {useFormsStore} from "../../store/formsStore";
import {useCountriesStore} from "../../store/сountriesStore";
import {createFormSchema} from "../../schemas/formSchema";
import styles from "./UncontrolledForm.module.css";

type Props = {
    onSuccess: () => void;
};

type Errors = Partial<
    Record<
        | "name"
        | "age"
        | "email"
        | "password"
        | "confirmPassword"
        | "gender"
        | "country"
        | "terms",
        string
    >
>;

export function UncontrolledForm({onSuccess}: Props) {
    const addForm = useFormsStore((state) => state.addForm);
    const countries = useCountriesStore((state) => state.countries);

    const schema = createFormSchema(countries);

    const [errors, setErrors] = useState<Errors>({});

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const data = {
            name: String(formData.get("name") ?? ""),
            age: Number(formData.get("age")),
            email: String(formData.get("email") ?? ""),
            password: String(formData.get("password") ?? ""),
            confirmPassword: String(formData.get("confirmPassword") ?? ""),
            gender: String(formData.get("gender") ?? ""),
            country: String(formData.get("country") ?? ""),
            terms: formData.get("terms") === "on",
        };

        const result = schema.safeParse(data);

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;

            setErrors({
                name: fieldErrors.name?.[0],
                age: fieldErrors.age?.[0],
                email: fieldErrors.email?.[0],
                password: fieldErrors.password?.[0],
                confirmPassword: fieldErrors.confirmPassword?.[0],
                gender: fieldErrors.gender?.[0],
                country: fieldErrors.country?.[0],
                terms: fieldErrors.terms?.[0],
            });

            return;
        }

        setErrors({});

        addForm({
            ...result.data,
            id: crypto.randomUUID(),
            source: "uncontrolled",
            createdAt: Date.now(),
        });

        e.currentTarget.reset();
        onSuccess();
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Uncontrolled Form</h2>

            <div className={styles.field}>
                <label htmlFor="u-name">Name</label>
                <input id="u-name" name="name"/>
                <div className={styles.error}>{errors.name}</div>
            </div>

            <div className={styles.field}>
                <label htmlFor="u-age">Age</label>
                <input id="u-age" name="age" type="number"/>
                <div className={styles.error}>{errors.age}</div>
            </div>

            <div className={styles.field}>
                <label htmlFor="u-email">Email</label>
                <input id="u-email" name="email" type="email"/>
                <div className={styles.error}>{errors.email}</div>
            </div>

            <div className={styles.field}>
                <label htmlFor="u-password">Password</label>
                <input id="u-password" name="password" type="password"/>
                <div className={styles.error}>{errors.password}</div>
            </div>

            <div className={styles.field}>
                <label htmlFor="u-confirmPassword">Confirm Password</label>
                <input id="u-confirmPassword" name="confirmPassword" type="password"/>
                <div className={styles.error}>{errors.confirmPassword}</div>
            </div>

            <div className={styles.field}>
                <label htmlFor="u-gender">Gender</label>
                <select id="u-gender" name="gender">
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
                <div className={styles.error}>{errors.gender}</div>
            </div>

            <div className={styles.field}>
                <label htmlFor="u-country">Country</label>
                <select id="u-country" name="country">
                    <option value="">Select country</option>
                    {countries.map((country) => (
                        <option key={country} value={country}>
                            {country}
                        </option>
                    ))}
                </select>
                <div className={styles.error}>{errors.country}</div>
            </div>

            <div className={styles.field}>
                <div>
                    <input id="u-terms" name="terms" type="checkbox"/>
                    <label htmlFor="u-terms" style={{marginLeft: "8px"}}>
                        Accept Terms & Conditions
                    </label>
                </div>
                <div className={styles.error}>{errors.terms}</div>
            </div>

            <button type="submit">Submit</button>
        </form>
    );
}