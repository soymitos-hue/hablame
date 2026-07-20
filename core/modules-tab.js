/**
 * core/modules-tab.js
 * Gestiona de forma aislada la vista de la pestaña "Módulos" (Juegos y Actividades).
 */

class ModulesTabManager {
    constructor() {
        this.activities = [
            {
                id: 'eugenia_robotics',
                title: 'Eugenia y la Robótica',
                icon: '🤖',
                description: 'Aprende mecánica, electricidad y programación de forma interactiva.',
                color: '#4f46e5'
            },
            {
                id: 'academic_math',
                title: 'Desafío Matemático',
                icon: '🧮',
                description: 'Juegos de conteo, cálculo y seriación adaptados.',
                color: '#16a34a'
            }
        ];
    }

    init() {
        this.interceptMainNavbar();
        this.createModulesViewContainer();
    }

    // Intercepta el clic en la pestaña "Módulos" sin romper el core/module-loader.js
    interceptMainNavbar() {
        const navbar = document.getElementById('navigation-panel');
        if (!navbar) return;

        navbar.addEventListener('click', (e) => {
            const btn = e.target.closest('.nav-btn');
            if (!btn) return;

            // Buscamos si el botón pulsado corresponde a la pestaña de Módulos (🎰)
            const isModulesTab = btn.innerHTML.includes('🎰') || btn.innerText.includes('Módulos');
            
            if (isModulesTab) {
                if (window.moduleLoader) {
                    window.moduleLoader.currentMainTab = 'modules';
                    window.moduleLoader.renderFooterNavbar();
                }
                this.showModulesView();
            }
        });
    }

    // Crea el contenedor oculto en el DOM de la aplicación
    createModulesViewContainer() {
        if (document.getElementById('modules-view')) return;

        const mainContainer = document.querySelector('main') || document.body;
        const modulesView = document.createElement('div');
        modulesView.id = 'modules-view';
        modulesView.style.display = 'none';
        modulesView.style.padding = '15px';
        modulesView.style.height = 'calc(100vh - 170px)';
        modulesView.style.overflowY = 'auto';

        modulesView.innerHTML = `
            <h2 style="margin-bottom: 15px; color: #333; font-size: 1.5rem; display: flex; align-items: center; gap: 10px;">
                <span>🎰</span> Módulos y Actividades Pedagógicas
            </h2>
            <div id="modules-activities-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
                <!-- Las tarjetas se cargan dinámicamente -->
            </div>
        `;

        mainContainer.appendChild(modulesView);
        this.renderActivityCards();
    }

    // Muestra visualmente la interfaz de módulos y oculta las demás vistas del core
    showModulesView() {
        const gridView = document.getElementById('content-grid');
        const infoView = document.getElementById('info-view');
        const subPanel = document.getElementById('subcategories-panel');
        const modulesView = document.getElementById('modules-view');

        if (gridView) gridView.style.display = 'none';
        if (subPanel) subPanel.style.display = 'none';
        if (infoView) infoView.style.display = 'none';
        
        if (modulesView) modulesView.style.display = 'block';
    }

    // Renderiza cada juego o actividad interactiva disponible
    renderActivityCards() {
        const grid = document.getElementById('modules-activities-grid');
        if (!grid) return;
        grid.innerHTML = '';

        this.activities.forEach(act => {
            const card = document.createElement('div');
            card.style.cssText = `
                background: white;
                border-radius: 16px;
                border: 3px solid ${act.color};
                box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
                overflow: hidden;
                display: flex;
                flex-direction: column;
                cursor: pointer;
                transition: transform 0.2s ease;
            `;

            card.innerHTML = `
                <div style="background: ${act.color}; padding: 20px; text-align: center; color: white;">
                    <span style="font-size: 3.5rem; display: block; margin-bottom: 5px;">${act.icon}</span>
                    <h3 style="margin: 0; font-size: 1.3rem; font-weight: bold;">${act.title}</h3>
                </div>
                <div style="padding: 15px; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; gap: 15px;">
                    <p style="margin: 0; font-size: 0.95rem; color: #555; line-height: 1.4;">${act.description}</p>
                    <button style="
                        width: 100%;
                        background: ${act.color};
                        color: white;
                        border: none;
                        padding: 12px;
                        border-radius: 10px;
                        font-weight: bold;
                        font-size: 1rem;
                        cursor: pointer;">
                        ¡Jugar ahora! 🚀
                    </button>
                </div>
            `;

            card.addEventListener('mouseenter', () => card.style.transform = 'scale(1.02)');
            card.addEventListener('mouseleave', () => card.style.transform = 'scale(1)');
            
            card.addEventListener('click', () => {
                this.launchActivity(act.id);
            });

            grid.appendChild(card);
        });
    }

    // Lanza el entorno interactivo de la actividad seleccionada
    launchActivity(id) {
        if (id === 'eugenia_robotics') {
            if (window.EugeniaRoboticsModule) {
                window.EugeniaRoboticsModule.start();
            } else {
                alert('Iniciando entorno interactivo de Robótica...');
            }
        } else {
            alert(`Cargando la actividad pedagógica: ${id}`);
        }
    }
}

// Inicialización automática al cargar el archivo
window.modulesTabManager = new ModulesTabManager();
document.addEventListener('DOMContentLoaded', () => window.modulesTabManager.init());