/**
 * core/module-loader.js
 * Renderizador dinámico de interfaz conducido 100% por datos del Almacenamiento Local.
 */

class ModuleLoader {
    constructor() {
        this.mainTabs = [
            { id: 'home', name: 'Inicio', icon: '🏠' },
            { id: 'phrases', name: 'Frases', icon: '⭐' },
            { id: 'modules', name: 'Módulos', icon: '🎰' },
            { id: 'config', name: 'Ajustes', icon: '⚙️' },
            { id: 'info', name: 'Información', icon: 'ℹ️' }
        ];
        this.currentMainTab = 'home';
        this.currentSubCategory = 'basic';

        this.quickPhrases = [
            { text: 'Tengo hambre.', icon: '😋' },
            { text: 'Tengo sed.', icon: '🥛' },
            { text: 'Necesito ir al baño.', icon: '🚽' },
            { text: 'Necesito ayuda.', icon: '🆘' },
            { text: 'Me duele.', icon: '🩹' },
            { text: 'Quiero ir a casa.', icon: '🏠' }
        ];
    }

    init() {
        this.renderFooterNavbar();
        this.renderSubCategoriesHeaders();
        this.loadGridContent();
        this.renderQuickPhrases();
        this.updateDynamicCategorySelectors();
    }

    renderFooterNavbar() {
        const navbar = document.getElementById('navigation-panel');
        if (!navbar) return;
        navbar.innerHTML = '';

        this.mainTabs.forEach(tab => {
            const btn = document.createElement('button');
            btn.className = `nav-btn ${tab.id === this.currentMainTab ? 'active' : ''}`;
            btn.innerHTML = `
                <span style="font-size: 1.3rem;">${tab.icon}</span>
                <span class="nav-text">${tab.name}</span>
            `;

            btn.addEventListener('click', () => {
                if (tab.id === 'config') {
                    const modal = document.getElementById('config-modal');
                    if (modal) modal.style.display = 'flex';
                } else if (tab.id === 'info') {
                    this.currentMainTab = 'info';
                    this.switchView('info');
                    this.renderFooterNavbar();
                } else if (tab.id === 'home') {
                    this.currentMainTab = 'home';
                    this.switchView('grid');
                    this.renderFooterNavbar();
                } else {
                    alert(`Navegando al módulo: ${tab.name}`);
                }
            });
            navbar.appendChild(btn);
        });
    }

   switchView(viewName) {
        const gridView = document.getElementById('content-grid');
        const infoView = document.getElementById('info-view');
        const subPanel = document.getElementById('subcategories-panel');
        const modulesView = document.getElementById('modules-view'); // <- Línea añadida

        if (modulesView) modulesView.style.display = 'none'; // <- Línea añadida

        if (viewName === 'info') {
            if (gridView) gridView.style.display = 'none';
            if (subPanel) subPanel.style.display = 'none';
            if (infoView) infoView.style.display = 'block';
        } else {
            if (infoView) infoView.style.display = 'none';
            if (gridView) gridView.style.display = 'grid';
            if (subPanel) subPanel.style.display = 'flex';
        }
    }

    renderSubCategoriesHeaders() {
        const subPanel = document.getElementById('subcategories-panel');
        if (!subPanel) return;
        subPanel.innerHTML = '';

        // Lectura 100% dinámica desde el storage
        const categories = window.appStorage.getCategories();

        // Evitar que nos quedemos en una categoría inexistente si se borra algo
        if (categories.length > 0 && !categories.some(c => c.id === this.currentSubCategory)) {
            this.currentSubCategory = categories[0].id;
        }

        categories.forEach(cat => {
            const tab = document.createElement('div');
            tab.className = `sub-tab ${cat.id === this.currentSubCategory ? 'active' : ''}`;
            tab.innerHTML = `<span>${cat.icon}</span><span>${cat.name}</span>`;
            
            tab.addEventListener('click', () => {
                this.currentSubCategory = cat.id;
                this.renderSubCategoriesHeaders();
                this.loadGridContent();
            });
            subPanel.appendChild(tab);
        });
    }

    loadGridContent() {
        const grid = document.getElementById('content-grid');
        if (!grid) return;
        grid.innerHTML = '';

        // Carga directa de la base de datos local según la categoría activa
        let mergedList = window.appStorage.getPictogramsByCategory(this.currentSubCategory);

        mergedList.forEach(picto => {
            const card = document.createElement('div');
            card.className = `picto-card picto-${picto.type || 'object'}`;

            const isCustomImg = picto.img.startsWith('data:') || picto.img.startsWith('http');
            const renderVisual = isCustomImg 
                ? `<img src="${picto.img}" class="picto-img" alt="${picto.text}">`
                : `<span class="picto-img">${picto.img}</span>`;

            card.innerHTML = `
                ${renderVisual}
                <span class="picto-text">${picto.text}</span>
            `;

            card.addEventListener('click', () => {
                if (window.sentenceEngine) window.sentenceEngine.addWord(picto);
            });
            grid.appendChild(card);
        });
    }

    renderQuickPhrases() {
        const quickGrid = document.getElementById('quick-phrases-grid');
        if (!quickGrid) return;
        quickGrid.innerHTML = '';

        this.quickPhrases.forEach(qp => {
            const btn = document.createElement('div');
            btn.className = 'quick-phrase-btn';
            btn.innerHTML = `<span style="font-size:1.2rem;">${qp.icon}</span><div>${qp.text}</div>`;
            btn.addEventListener('click', () => {
                if (window.speechEngine) window.speechEngine.speak(qp.text);
            });
            quickGrid.appendChild(btn);
        });
    }

    // Sincroniza el selector de categorías del Modal de Ajustes dinámicamente
    updateDynamicCategorySelectors() {
        const selectCat = document.getElementById('new-word-cat');
        if (!selectCat) return;
        selectCat.innerHTML = '';
        
        const categories = window.appStorage.getCategories();
        categories.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat.id;
            opt.textContent = `${cat.icon} ${cat.name}`;
            selectCat.appendChild(opt);
        });
    }
}

window.moduleLoader = new ModuleLoader();
document.addEventListener('DOMContentLoaded', () => window.moduleLoader.init());