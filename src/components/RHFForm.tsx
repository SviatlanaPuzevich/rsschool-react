import { useForm } from "react-hook-form";

type FormValues = {
    name: string;
    age: number;
    email: string;
    gender: string;
    terms: boolean;
};

export function RHFForm() {
    const { register, handleSubmit } = useForm<FormValues>();

    const onSubmit = (data: FormValues) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h2>React Hook Form</h2>

            <div>
                <label htmlFor="r-name">Name</label>
                <input id="r-name" {...register("name")} />
            </div>

            <div>
                <label htmlFor="r-age">Age</label>
                <input
                    id="r-age"
                    type="number"
                    {...register("age", {
                        valueAsNumber: true,
                    })}
                />
            </div>

            <div>
                <label htmlFor="r-email">Email</label>
                <input
                    id="r-email"
                    type="email"
                    {...register("email")}
                />
            </div>

            <div>
                <label htmlFor="r-gender">Gender</label>
                <select id="r-gender" {...register("gender")}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <div>
                <input
                    id="r-terms"
                    type="checkbox"
                    {...register("terms")}
                />
                <label htmlFor="r-terms">
                    Accept Terms & Conditions
                </label>
            </div>

            <button type="submit">Submit</button>
        </form>
    );
}