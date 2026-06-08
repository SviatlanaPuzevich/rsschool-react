import { useForm } from "react-hook-form";
import { countries } from "../../constants/countries.ts";
import { useFormsStore } from "../../store/formsStore.ts";
import styles from "./RHFForm.module.css";

type FormValues = {
    name: string;
    age: number;
    email: string;
    gender: string;
    terms: boolean;
    country: string;
    password: string;
};

type Props = {
    onSuccess: () => void;
}

export function RHFForm({ onSuccess }: Props) {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormValues>();

    const addForm = useFormsStore((state) => state.addForm);

    const onSubmit = (data: FormValues) => {
        addForm({
            ...data,
            id: crypto.randomUUID(),
            source: "rhf",
            createdAt: Date.now(),
        });

        onSuccess();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h2>React Hook Form</h2>

            <div className={styles.field}>
                <label htmlFor="r-name">Name</label>
                <input id="r-name" {...register("name")} />
                <div className={styles.error}>
                    {errors.name?.message}
                </div>
            </div>

            <div className={styles.field}>
                <label htmlFor="r-age">Age</label>
                <input
                    id="r-age"
                    type="number"
                    {...register("age", { valueAsNumber: true })}
                />
                <div className={styles.error}>
                    {errors.age?.message}
                </div>
            </div>

            <div className={styles.field}>
                <label htmlFor="r-email">Email</label>
                <input id="r-email" type="email" {...register("email")} />
                <div className={styles.error}>
                    {errors.email?.message}
                </div>
            </div>

            <div className={styles.field}>
                <label htmlFor="r-password">Password</label>
                <input id="r-password" type="password" {...register("password")} />
                <div className={styles.error}>
                    {errors.password?.message}
                </div>
            </div>

            <div className={styles.field}>
                <label htmlFor="r-gender">Gender</label>
                <select id="r-gender" {...register("gender")}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
                <div className={styles.error}>
                    {errors.gender?.message}
                </div>
            </div>

            <div className={styles.field}>
                <label htmlFor="r-country">Country</label>
                <select id="r-country" {...register("country")}>
                    {countries.map((country) => (
                        <option key={country} value={country}>
                            {country}
                        </option>
                    ))}
                </select>
                <div className={styles.error}>
                    {errors.country?.message}
                </div>
            </div>

            <div className={styles.field}>
                <div>
                    <input
                        id="r-terms"
                        type="checkbox"
                        {...register("terms")}
                    />
                    <label htmlFor="r-terms" style={{ marginLeft: '8px' }}>
                        Accept Terms & Conditions
                    </label>
                </div>
                <div className={styles.error}>
                    {errors.terms?.message}
                </div>
            </div>

            <button type="submit">Submit</button>
        </form>
    );
}