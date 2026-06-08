import { useState } from "react";
import { Modal } from "./components/Modal/Modal.tsx";
import { UncontrolledForm } from "./components/UncontrolledForm/UncontrolledForm.tsx";
import { RHFForm } from "./components/RHFForm/RHFForm.tsx";
import styles from "./app.module.css";
import {useFormsStore} from "./store/formsStore.ts";
import {FormCard} from "./components/FormCard/FormCard.tsx";

function App() {
  const [open, setOpen] = useState(false);
    const forms = useFormsStore(
        (state) => state.forms
    );

    const latestId = useFormsStore(
        (state) => state.latestId
    );

  return (
      <div className={styles.container}>
        <button className={styles.btn} onClick={() => setOpen(true)}>
          Open Modal
        </button>
          <section className={styles.cards}>
              {forms.map((form) => (
                  <FormCard
                      key={form.id}
                      form={form}
                      isLatest={form.id === latestId}
                  />
              ))}
          </section>

        <Modal
            isOpen={open}
            onClose={() => setOpen(false)}
        >
          <div className={styles.formsGrid}>
            <UncontrolledForm onSuccess={() => setOpen(false)} />
            <RHFForm onSuccess={() => setOpen(false)} />
          </div>
        </Modal>
      </div>
  );
}

export default App;