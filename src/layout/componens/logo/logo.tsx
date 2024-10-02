import { useTranslation } from 'react-i18next';

export default function Logo() {
    const { t } = useTranslation();

    return (
        <div style={{
            fontSize: '19px',
            fontWeight: 700,
            textAlign: 'center',
            padding: '20px 0'
        }}>
            AKY | {t('安琪能')}
        </div>
    )
}
