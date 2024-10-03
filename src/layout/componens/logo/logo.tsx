export default function Logo() {
    const NAME = import.meta.env.VITE_NAME

    return (
        <div style={{
            fontSize: '19px',
            fontWeight: 700,
            textAlign: 'center',
            padding: '20px 0'
        }}>
            {NAME}
        </div>
    )
}
