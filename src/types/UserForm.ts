export type UserForm = {
    id: string;
    source: "uncontrolled" | "rhf";

    name: string;
    age: number;
    email: string;
    password: string;

    gender: string;
    country: string;

    terms: boolean;
    createdAt: number;
};