import { create } from "zustand";
import { type UserForm } from "../types/UserForm";

type FormsState = {
    forms: UserForm[];
    latestId: string | null;

    addForm: (form: UserForm) => void;
};

export const useFormsStore = create<FormsState>((set) => ({
    forms: [],
    latestId: null,

    addForm: (form) =>
        set((state) => ({
            forms: [form, ...state.forms],
            latestId: form.id,
        })),
}));