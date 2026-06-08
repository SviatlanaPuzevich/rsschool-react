import { FormEvent } from "react";

export function UncontrolledForm() {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = new FormData(e.currentTarget);

        console.log({
            name: form.get("name"),
            age: form.get("age"),
            email: form.get("email"),
            gender: form.get("gender"),
            terms: form.get("terms"),
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Uncontrolled Form</h2>

            <div>
                <label htmlFor="u-name">Name</label>
                <input id="u-name" name="name" />
            </div>

            <div>
                <label htmlFor="u-age">Age</label>
                <input id="u-age" name="age" type="number" />
            </div>

            <div>
                <label htmlFor="u-email">Email</label>
                <input id="u-email" name="email" type="email" />
            </div>

            <div>
                <label htmlFor="u-gender">Gender</label>
                <select id="u-gender" name="gender">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <div>
                <input
                    id="u-terms"
                    name="terms"
                    type="checkbox"
                    value="accepted"
                />
                <label htmlFor="u-terms">
                    Accept Terms & Conditions
                </label>
            </div>

            <button type="submit">Submit</button>
        </form>
    );
}