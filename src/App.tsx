import { useState } from "react";
import { Modal } from "./components/Modal";
import { UncontrolledForm } from "./components/UncontrolledForm";
import { RHFForm } from "./components/RHFForm";
import styles from "./app.module.css";

function App() {
  const [open, setOpen] = useState(false);

  return (
      <div className={styles.container}>
        <button onClick={() => setOpen(true)}>
          Open Modal
        </button>

        <Modal
            isOpen={open}
            onClose={() => setOpen(false)}
        >
          <div className={styles.formsGrid}>
            <UncontrolledForm />
            <RHFForm />
          </div>
        </Modal>
      </div>
  );
}

export default App;