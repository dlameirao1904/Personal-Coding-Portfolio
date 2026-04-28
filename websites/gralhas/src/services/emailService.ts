import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_juagv57';
const PUBLIC_KEY = 'otlW_m9QoL0IUQ6jo';

/**
 * Função global para enviar emails de qualquer parte do site
 * @param templateId O ID do template específico que queres usar (ex: form de sócio ou form de contacto)
 * @param templateParams Os dados do formulário a enviar
 */
export const enviarEmail = async (templateId: string, templateParams: Record<string, any>) => {
    try {
        const response = await emailjs.send(SERVICE_ID, templateId, templateParams, PUBLIC_KEY);
        return response;
    } catch (error) {
        console.error('Erro no EmailJS:', error);
        throw error;
    }
};
