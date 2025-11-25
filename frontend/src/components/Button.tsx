import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
}

export default function Button({ children, variant = 'primary', ...props }: ButtonProps) {
    return (
        <button className={`${styles.button} ${styles[variant]}`} {...props}>
            {children}
        </button>
    );
}
