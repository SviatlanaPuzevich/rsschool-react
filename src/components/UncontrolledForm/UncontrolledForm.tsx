import { FormEvent, useState } from "react";
import { useFormsStore } from "../../store/formsStore.ts";
import { countries } from "../../constants/countries.ts"; // Импортируем страны
import styles from "./UncontrolledForm.module.css"; // Импортируем стили

type Props = {
    onSuccess: () => void;
}

export function UncontrolledForm( {onSuccess}: Props ) {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const addForm = useFormsStore((state) => state.addForm);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        setErrors({});
        const newErrors: Record<string, string> = {};

        const name = String(formData.get("name"));
        const password = String(formData.get("password"));

        if (!name.trim()) newErrors.name = "Name is required";
        if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        addForm({
            id: crypto.randomUUID(),
            source: "uncontrolled",
            name,
            age: Number(formData.get("age")),
            email: String(formData.get("email")),
            password,
            gender: String(formData.get("gender")),
            country: String(formData.get("country")),
            terms: Boolean(formData.get("terms")),
            createdAt: Date.now(),
        });

        onSuccess();
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Uncontrolled Form</h2>

            <div className={styles.field}>
                <label htmlFor="u-name">Name</label>
                <input id="u-name" name="name" />
                <div className={styles.error}>{errors.name}</div>
            </div>

            <div className={styles.field}>
                <label htmlFor="u-age">Age</label>
                <input id="u-age" name="age" type="number" />
                <div className={styles.error}>{errors.age}</div>
            </div>

            <div className={styles.field}>
                <label htmlFor="u-email">Email</label>
                <input id="u-email" name="email" type="email" />
                <div className={styles.error}>{errors.email}</div>
            </div>

            <div className={styles.field}>
                <label htmlFor="u-password">Password</label>
                <input id="u-password" name="password" type="password" />
                <div className={styles.error}>{errors.password}</div>
            </div>

            {/* Gender */}
            <div className={styles.field}>
                <label htmlFor="u-gender">Gender</label>
                <select id="u-gender" name="gender">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
                <div className={styles.error}>{errors.gender}</div>
            </div>

            <div className={styles.field}>
                <label htmlFor="u-country">Country</label>
                <select id="u-country" name="country">
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
                    <input
                        id="u-terms"
                        name="terms"
                        type="checkbox"
                        value="accepted"
                    />
                    <label htmlFor="u-terms" style={{ marginLeft: '8px' }}>
                        Accept Terms & Conditions
                    </label>
                </div>
                <div className={styles.error}>{errors.terms}</div>
            </div>

            <button type="submit">Submit</button>
        </form>
    );
}