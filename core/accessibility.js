const Accessibility = {
    audioCtx: null,
    soundEnabled: true,
    size: 'normal',
    contrast: 'normal',

    init() {
        this.loadSettings();
        this.applyDOMSettings();
        this.bindEvents();
    },

    loadSettings() {
        const config = CAAStorage.get('config', { size: 'normal', contrast: 'normal', sound: true });
        this.soundEnabled = config.sound !== undefined ? config.sound : true;
        this.size = config.size || 'normal';
        this.contrast = config.contrast || 'normal';
    },

    applyDOMSettings() {
        const grid = document.getElementById('content-grid');
        if (!grid) return;
        
        if (this.size === 'large') grid.classList.add('btn-size-large');
        else grid.classList.remove('btn-size-large');

        if (this.contrast === 'high') document.body.classList.add('high-contrast');
        else document.body.classList.remove('high-contrast');
        
        const sizeEl = document.getElementById('cfg-size');
        const contrastEl = document.getElementById('cfg-contrast');
        const soundEl = document.getElementById('cfg-sound');
        
        if (sizeEl) sizeEl.value = this.size;
        if (contrastEl) contrastEl.value = this.contrast;
        if (soundEl) soundEl.checked = this.soundEnabled;
    },

    bindEvents() {
        const modal = document.getElementById('config-modal');
        const toggle = document.getElementById('config-toggle');
        const close = document.getElementById('cfg-close');
        const saveWordBtn = document.getElementById('cmd-save-custom-word');

        if (toggle && modal) {
            toggle.addEventListener('click', () => {
                this.populateVoices();
                modal.style.display = 'flex';
            });
        }
        
        if (close && modal) {
            close.addEventListener('click', () => {
                this.saveSettings();
                modal.style.display = 'none';
            });
        }

        if (saveWordBtn) {
            saveWordBtn.addEventListener('click', () => {
                const textInput = document.getElementById('new-word-text');
                const imgInput = document.getElementById('new-word-img');
                const catSelect = document.getElementById('new-word-cat');
                const typeSelect = document.getElementById('new-word-type');

                if (!textInput || !imgInput || !catSelect || !typeSelect) return;

                const text = textInput.value.trim().toLowerCase();
                const image = imgInput.value.trim();
                const category = catSelect.value;
                const type = typeSelect.value;

                if (!text || !image) {
                    alert("Por favor, introduce un texto y un emoji/imagen.");
                    return;
                }

                const customGallery = CAAStorage.get('custom_gallery', []);
                const newWord = { text, image, category, type };

                customGallery.push(newWord);
                CAAStorage.save('custom_gallery', customGallery);

                textInput.value = '';
                imgInput.value = '';
                alert(`¡"${text.toUpperCase()}" se ha añadido correctamente a tu galería!`);

                if (ModuleLoader.activeModuleId === category) {
                    ModuleLoader.loadModule(category);
                }
            });
        }
    },

    populateVoices() {
        const select = document.getElementById('cfg-voice');
        if (!select) return;
        select.innerHTML = '';
        window.speechSynthesis.getVoices().forEach(voice => {
            const opt = document.createElement('option');
            opt.value = voice.voiceURI;
            opt.textContent = `${voice.name} (${voice.lang})`;
            if (SpeechEngine.voice && SpeechEngine.voice.voiceURI === voice.voiceURI) {
                opt.selected = true;
            }
            select.appendChild(opt);
        });
        const rateEl = document.getElementById('cfg-rate');
        if (rateEl) rateEl.value = SpeechEngine.rate;
    },

    saveSettings() {
        const sizeEl = document.getElementById('cfg-size');
        const contrastEl = document.getElementById('cfg-contrast');
        const soundEl = document.getElementById('cfg-sound');
        const voiceEl = document.getElementById('cfg-voice');
        const rateEl = document.getElementById('cfg-rate');

        const size = sizeEl ? sizeEl.value : 'normal';
        const contrast = contrastEl ? contrastEl.value : 'normal';
        const sound = soundEl ? soundEl.checked : true;
        const voiceURI = voiceEl ? voiceEl.value : '';
        const rate = rateEl ? parseFloat(rateEl.value) : 1.0;

        const config = { size, contrast, sound, voiceURI, rate };
        CAAStorage.save('config', config);
        
        this.loadSettings();
        this.applyDOMSettings();
        
        SpeechEngine.rate = rate;
        const voices = window.speechSynthesis.getVoices();
        SpeechEngine.voice = voices.find(v => v.voiceURI === voiceURI) || SpeechEngine.voice;
    },

    playFeedback() {
        if (!this.soundEnabled) return;
        if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, this.audioCtx.currentTime); 
        gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.1);
        
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.1);
    }
};