/**
 * core/app.js
 * Orquestador principal, vinculación de botones operativos y carga de imágenes/emojis.
 */

document.addEventListener('DOMContentLoaded', () => {
    if (window.moduleLoader && typeof window.moduleLoader.init === 'function') {
        console.log("Núcleo cargado y sincronizado correctamente.");
    // Dentro del inicio de tu app.js añade esto para que cargue al arrancar:
if (window.sentenceEngine && typeof window.sentenceEngine.renderSavedPhrasesList === 'function') {
    window.sentenceEngine.renderSavedPhrasesList();
}
    }

    // ==========================================
    // 1. BOTONERA OPERATIVA PRINCIPAL
    // ==========================================
    const btnSpeak = document.getElementById('cmd-speak');
    if (btnSpeak) {
        btnSpeak.addEventListener('click', () => {
            if (window.sentenceEngine && window.speechEngine) {
                const textoFrase = window.sentenceEngine.getCompleteText();
                window.speechEngine.speak(textoFrase || "Pizarra vacía");
            }
        });
    }

    const btnClear = document.getElementById('cmd-clear');
    if (btnClear) {
        btnClear.addEventListener('click', () => {
            if (window.sentenceEngine) window.sentenceEngine.clear();
        });
    }

    const btnRepeat = document.getElementById('cmd-repeat');
    if (btnRepeat) {
        btnRepeat.addEventListener('click', () => {
            if (window.sentenceEngine && window.speechEngine) {
                const textoFrase = window.sentenceEngine.getCompleteText();
                if (textoFrase) window.speechEngine.speak(textoFrase);
            }
        });
    }

    const btnSavePhrase = document.getElementById('cmd-save-phrase');
    if (btnSavePhrase) {
        btnSavePhrase.addEventListener('click', () => {
            if (window.sentenceEngine) {
                const textoFrase = window.sentenceEngine.getCompleteText();
                if (!textoFrase) {
                    alert("Primero construye una frase con los pictogramas.");
                    return;
                }
                let frasesGuardadas = JSON.parse(localStorage.getItem('saved_phrases') || '[]');
                if (!frasesGuardadas.includes(textoFrase)) {
                    frasesGuardadas.push(textoFrase);
                    localStorage.setItem('saved_phrases', JSON.stringify(frasesGuardadas));
                    alert("¡Frase guardada!");
                } else {
                    alert("Esta frase ya está guardada.");
                }
            }
        });
    }

    // ==========================================
    // 2. GUARDADO CON DOBLE COMPATIBILIDAD (EMOJI O IMAGEN)
    // ==========================================
    const btnGuardarPicto = document.getElementById('cmd-save-custom-word');
    if (btnGuardarPicto) {
        btnGuardarPicto.addEventListener('click', () => {
            const textInput = document.getElementById('new-word-text').value.trim();
            const emojiInput = document.getElementById('new-word-emoji').value.trim();
            const fileInput = document.getElementById('new-word-img');
            const catInput = document.getElementById('new-word-cat').value;
            const typeInput = document.getElementById('new-word-type').value;

            if (!textInput) {
                alert('Por favor, ingresa el nombre del pictograma.');
                return;
            }

            const procesarYGuardar = (imgSource) => {
                const nuevaPalabra = {
                    text: textInput,
                    img: imgSource,
                    type: typeInput,
                    category: catInput
                };

                if (window.appStorage && typeof window.appStorage.saveCustomWord === 'function') {
                    window.appStorage.saveCustomWord(nuevaPalabra);
                } else {
                    let customs = JSON.parse(localStorage.getItem('custom_pictograms') || '[]');
                    customs.push(nuevaPalabra);
                    localStorage.setItem('custom_pictograms', JSON.stringify(customs));
                }

                if (window.moduleLoader && typeof window.moduleLoader.loadGridContent === 'function') {
                    window.moduleLoader.loadGridContent();
                }

                alert('¡Pictograma creado y cargado con éxito!');
                
                document.getElementById('new-word-text').value = '';
                document.getElementById('new-word-emoji').value = '';
                if (fileInput) fileInput.value = '';
                document.getElementById('config-modal').style.display = 'none';
            };

            if (fileInput && fileInput.files && fileInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    procesarYGuardar(e.target.result);
                };
                reader.readAsDataURL(fileInput.files[0]);
            } else if (emojiInput) {
                procesarYGuardar(emojiInput);
            } else {
                procesarYGuardar('🖼️');
            }
        });
    }

    // ==========================================
    // 3. CONTROL DE CIERRE EXPLICITO PARA AJUSTES
    // ==========================================
    const btnCerrarAjustes = document.getElementById('cfg-close');
    if (btnCerrarAjustes) {
        btnCerrarAjustes.addEventListener('click', () => {
            const ventanaModal = document.getElementById('config-modal');
            if (ventanaModal) {
                ventanaModal.style.display = 'none';
            }
        });
    }
});