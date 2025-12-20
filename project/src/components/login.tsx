import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface FormValues {
    email: string;
    password: string;
}
const Login: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

    const onSubmit = async (data: FormValues) => {
        try {
            const response = await axios.post('http://localhost:4000/auth/login', data);
            const token = response.data.token;
            console.log(response.data.token);
            console.log(response.data.user.role);
        } catch (err) {
            console.error("שגיאה: ", err);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            {/* שדה אימייל */}
            <label htmlFor="email"></label>
            <input
                type="email"
                {...register("email", { required: "יש להזין אימייל", pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "כתובת אימייל לא תקינה" } })}
                placeholder="אימייל"
            />
            {errors.email && <p>{errors.email.message}</p>}

            {/* שדה סיסמה */}
            <label htmlFor="password"></label>
            <input
                type="password"
                {...register("password", { required: "יש להזין סיסמה", pattern: { value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, message: "הסיסמה חייבת לכלול אותיות ומספרים (מינימום 6)" }, minLength: { value: 6, message: "הסיסמה חייבת להיות לפחות 6 תווים" }, maxLength: { value: 16, message: "הסיסמה לא יכולה להיות יותר מ-16 תווים" } })}
                placeholder="סיסמה"
            />
            {errors.password && <p>{errors.password.message}</p>}

            <button type="submit">שלח</button>
        </form>
    );
};

export default Login;