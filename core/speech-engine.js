/**
 * core/speech-engine.js
 * Motor de síntesis de voz nativo optimizado para ejecución inmediata en teléfonos.
 */

class SpeechEngine {
    constructor() {
        // Forzar la carga inicial del motor en dispositivos móviles
        if (typeof speechSynthesis !== 'undefined' && speechSynthesis.getVoices !== undefined) {
            speechSynthesis.getVoices();
        }
    }

    /**
     * Ejecuta la síntesis de voz aplicando configuraciones nativas estables para móviles
     */
    speak(text) {
        if (!text || typeof speechSynthesis === 'undefined') return;

        // 1. Limpiar la cola de reproducción: VITAL para que responda rápido al tacto en el celular
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // 2. Forzar idioma en español (Latinoamérica / General)
        utterance.lang = 'es-419'; 

        // 3. Aplicar velocidad configurada en el slider si existe, si no, usa la normal (1.0)
        const rateInput = document.getElementById('cfg-rate');
        if (rateInput) {
            utterance.rate = parseFloat(rateInput.value);
        } else {
            utterance.rate = 1.0;
        }

        // 4. Reproducir inmediatamente
        speechSynthesis.speak(utterance);
    }
}

// Inicializar el motor de manera global en la ventana
window.speechEngine = new SpeechEngine();