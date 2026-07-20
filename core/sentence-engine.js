/**
 * core/sentence-engine.js
 * Orquestador de la barra acumulativa de frases con persistencia y renderizado dinámico.
 */

class SentenceEngine {
    constructor() {
        this.currentPhrase = [];
        // Espera a que el DOM esté listo para pintar las frases guardadas al iniciar la app
        document.addEventListener('DOMContentLoaded', () => this.renderSavedPhrasesList());
    }

    addWord(wordObject) {
        this.currentPhrase.push(wordObject);
        this.renderPhrase();
    }

    removeWord(index) {
        this.currentPhrase.splice(index, 1);
        this.renderPhrase();
    }

    clear() {
        this.currentPhrase = [];
        this.renderPhrase();
    }

    renderPhrase() {
        const visualArea = document.getElementById('visual-phrase');
        const textArea = document.getElementById('text-phrase');
        if (!visualArea || !textArea) return;

        visualArea.innerHTML = '';
        let stringAcc = [];

        this.currentPhrase.forEach((picto, idx) => {
            stringAcc.push(picto.text);

            const card = document.createElement('div');
            card.className = 'phrase-picto';

            const isCustomImg = picto.img.startsWith('data:') || picto.img.startsWith('http');
            const visualRender = isCustomImg 
                ? `<img src="${picto.img}" alt="${picto.text}">`
                : `<span class="picto-render">${picto.img}</span>`;

            card.innerHTML = `
                <button class="remove-btn" onclick="window.sentenceEngine.removeWord(${idx})">×</button>
                ${visualRender}
                <div class="phrase-text">${picto.text}</div>
            `;

            visualArea.appendChild(card);
        });

        if (stringAcc.length > 0) {
            let fullText = stringAcc.join(' ');
            fullText = fullText.charAt(0).toUpperCase() + fullText.slice(1) + '.';
            textArea.textContent = fullText;
        } else {
            textArea.textContent = '';
        }
    }

    getCompleteText() {
        const textArea = document.getElementById('text-phrase');
        return textArea ? textArea.textContent : '';
    }

    /**
     * Guarda la frase actual formateada en el almacenamiento local.
     */
    saveCurrentPhrase() {
        const fullText = this.getCompleteText();
        if (!fullText) return;

        let savedPhrases = JSON.parse(localStorage.getItem('caa_saved_phrases') || '[]');

        if (savedPhrases.includes(fullText)) {
            alert("Esta frase ya está guardada.");
            return;
        }

        savedPhrases.push(fullText);
        localStorage.setItem('caa_saved_phrases', JSON.stringify(savedPhrases));

        // Forzar actualización visual inmediata
        this.renderSavedPhrasesList();
    }

    /**
     * Renderiza dinámicamente las frases guardadas en el panel asignado.
     */
    renderSavedPhrasesList() {
        const listContainer = document.getElementById('saved-phrases-list');
        if (!listContainer) return;

        const savedPhrases = JSON.parse(localStorage.getItem('caa_saved_phrases') || '[]');
        listContainer.innerHTML = '';

        if (savedPhrases.length === 0) {
            listContainer.innerHTML = `<span style="color: #94a3b8; font-size: 0.85rem; padding: 12px; font-style: italic; text-align: center;">No hay frases guardadas ⭐</span>`;
            return;
        }

        savedPhrases.forEach(phraseText => {
            const phraseBtn = document.createElement('button');
            phraseBtn.className = 'quick-phrase-btn';
            phraseBtn.style.cssText = 'width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 8px; text-align: left; background: white; border: 1px solid var(--border); border-radius: 8px; padding: 8px; cursor: pointer;';
            
            phraseBtn.innerHTML = `
                <span style="font-weight: 500; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">⭐ ${phraseText}</span>
                <span class="delete-phrase-btn" style="color: var(--btn-clear); font-weight: bold; font-size: 1.2rem; padding: 0 6px; cursor: pointer; transition: transform 0.1s;" title="Eliminar frase">×</span>
            `;

            // Al hacer clic en el cuerpo del botón, habla la frase
            phraseBtn.addEventListener('click', () => {
                if (window.speechEngine) window.speechEngine.speak(phraseText);
            });

            // Al hacer clic en la '×', se elimina la frase sin activar la voz
            const deleteX = phraseBtn.querySelector('.delete-phrase-btn');
            deleteX.addEventListener('click', (e) => {
                e.stopPropagation(); 
                this.deletePhrase(phraseText);
            });

            listContainer.appendChild(phraseBtn);
        });
    }

    /**
     * Elimina una frase específica del almacenamiento local.
     */
    deletePhrase(phraseText) {
        let savedPhrases = JSON.parse(localStorage.getItem('caa_saved_phrases') || '[]');
        savedPhrases = savedPhrases.filter(p => p !== phraseText);
        localStorage.setItem('caa_saved_phrases', JSON.stringify(savedPhrases));
        
        this.renderSavedPhrasesList();
    }
}

window.sentenceEngine = new SentenceEngine();