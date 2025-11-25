import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export default function Input({ label, ...props }: InputProps) {
    return (
        <div className={styles.wrapper}>
            <label className={styles.label}>{label}</label>
            <input className={styles.input} {...props} />
        </div>
    );
}
