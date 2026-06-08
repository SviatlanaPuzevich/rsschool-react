import { UserForm } from "../../types/UserForm";
import styles from "./FormCard.module.css";

type Props = {
    form: UserForm;
    isLatest: boolean;
};

export function FormCard({
                             form,
                             isLatest,
                         }: Props) {
    return (
        <article
            className={`${styles.card} ${
                isLatest ? styles.latest : ""
            }`}
        >
            <h3>{form.name}</h3>

            <p>Email: {form.email}</p>
            <p>Age: {form.age}</p>
            <p>Gender: {form.gender}</p>
            <p>Country: {form.country}</p>
            <p>Source: {form.source}</p>
        </article>
    );
}