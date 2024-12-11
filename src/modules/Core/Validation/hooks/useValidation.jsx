import { useState } from 'react';

export function useValidation(validations) {
    const [errors, setErrors] = useState({});

    const validate = (field, value) => {
        const validation = validations[field];
        if (validation) {
            const errorMessage = validation(value);
            setErrors((prevErrors) => ({
                ...prevErrors,
                [field]: errorMessage || null,
            }));
        }
    };

    const validateAll = (data) => {
        const newErrors = {};
        for (const field in validations) {
            const errorMessage = validations[field](data[field]);
            if (errorMessage) {
                newErrors[field] = errorMessage;
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
    };

    const clearError = (field) => {
        setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: null,
        }));
    };

    return { errors, validate, validateAll, clearError };
}
