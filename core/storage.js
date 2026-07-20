/**
 * core/storage.js
 * Gestión del almacenamiento local y persistencia del vocabulario base y personalizado.
 */

class AppStorage {
    constructor() {
        this.init();
    }

    init() {
        // Si no existen las categorías base en el almacenamiento, las creamos
        if (!localStorage.getItem('caa_categories')) {
            const defaultCategories = [
                { id: 'basic', name: 'Básico', icon: '💬' },
                { id: 'people', name: 'Personas', icon: '👥' },
                { id: 'food', name: 'Comida', icon: '🍏' },
                { id: 'drinks', name: 'Bebidas', icon: '🥤' },
                { id: 'actions', name: 'Acciones', icon: '🏃' },
                { id: 'emotions', name: 'Emociones', icon: '😊' },
                { id: 'places', name: 'Lugares', icon: '📍' }
            ];
            localStorage.setItem('caa_categories', JSON.stringify(defaultCategories));
        }

        // Si no existen los pictogramas base, instalamos el vocabulario infantil expandido
       // Si no existen los pictogramas base, instalamos el vocabulario escolar/tecnológico expandido (6-13 años)
        if (!localStorage.getItem('caa_pictograms')) {
            const defaultPictograms = {
                basic: [
                    { text: 'Yo', img: '👦', type: 'person' },
                    { text: 'Tú', img: '🫵', type: 'person' },
                    { text: 'Quiero', img: '🤲', type: 'intention' },
                    { text: 'No quiero', img: '🙅', type: 'intention' },
                    { text: 'Necesito', img: '🚨', type: 'intention' },
                    { text: 'Me gusta', img: '👍', type: 'intention' },
                    { text: 'No me gusta', img: '👎', type: 'intention' },
                    { text: '¿Cómo?', img: '❓', type: 'intention' },
                    { text: 'Ayúdame', img: '🆘', type: 'action' },
                    { text: 'Entendido', img: '💡', type: 'intention' },
                    { text: 'No entiendo', img: '🤷', type: 'intention' },
                    { text: 'Más', img: '➕', type: 'intention' },
                    { text: 'Terminé', img: '🏁', type: 'intention' }
                ],
                people: [
                    { text: 'Yo', img: '👦', type: 'person' },
                    { text: 'Mamá', img: '👩', type: 'person' },
                    { text: 'Papá', img: '👨', type: 'person' },
                    { text: 'Profesor(a)', img: '🧑‍🏫', type: 'person' },
                    { text: 'Compañero / Amigo', img: '🧒', type: 'person' },
                    { text: 'Equipo / Grupo', img: '👥', type: 'person' },
                    { text: 'Hermano/a', img: '🧑‍🤝‍🧑', type: 'person' },
                    { text: 'Instructor', img: '🧑‍💻', type: 'person' }
                ],
                food: [
                    { text: 'Sandía', img: '🍉', type: 'object' },
                    { text: 'Manzana', img: '🍎', type: 'object' },
                    { text: 'Pan', img: '🍞', type: 'object' },
                    { text: 'Arroz', img: '🍚', type: 'object' },
                    { text: 'Galleta', img: '🍪', type: 'object' },
                    { text: 'Almuerzo escolar', img: '🍱', type: 'object' },
                    { text: 'Fruta', img: '🍌', type: 'object' },
                    { text: 'Pollo', img: '🍗', type: 'object' }
                ],
                drinks: [
                    { text: 'Agua', img: '💧', type: 'object' },
                    { text: 'Leche', img: '🥛', type: 'object' },
                    { text: 'Jugo', img: '🧃', type: 'object' },
                    { text: 'Batido', img: '🥤', type: 'object' }
                ],
                actions: [
                    { text: 'Estudiar / Leer', img: '📚', type: 'action' },
                    { text: 'Programar', img: '💻', type: 'action' },
                    { text: 'Construir / Armar', img: '🛠️', type: 'action' },
                    { text: 'Dibujar / Diseñar', img: '🎨', type: 'action' },
                    { text: 'Escribir', img: '✍️', type: 'action' },
                    { text: 'Jugar / Conectar', img: '🎮', type: 'action' },
                    { text: 'Correr / Moverse', img: '🏃', type: 'action' },
                    { text: 'Guardar / Ordenar', img: '📦', type: 'action' },
                    { text: 'Prender / Activar', img: '🟢', type: 'action' },
                    { text: 'Apagar / Detener', img: '🔴', type: 'action' },
                    { text: 'Lavarse las manos', img: '🧼', type: 'action' }
                ],
                emotions: [
                    { text: 'Feliz / Logrado', img: '😊', type: 'intention' },
                    { text: 'Triste / Frustrado', img: '😢', type: 'intention' },
                    { text: 'Concentrado', img: '🧐', type: 'intention' },
                    { text: 'Asustado / Nervioso', img: '😨', type: 'intention' },
                    { text: 'Cansado', img: '😴', type: 'intention' },
                    { text: 'Me duele', img: '🩹', type: 'intention' },
                    { text: 'Orgulloso', img: '😎', type: 'intention' },
                    { text: 'Curioso / Idea', img: '💡', type: 'intention' }
                ],
                places: [
                    { text: 'Casa', img: '🏠', type: 'object' },
                    { text: 'Escuela / Colegio', img: '🏫', type: 'object' },
                    { text: 'Laboratorio / Aula STEAM', img: '🔬', type: 'object' },
                    { text: 'Baño', img: '🚽', type: 'object' },
                    { text: 'Patio / Recreo', img: '🌳', type: 'object' },
                    { text: 'Biblioteca', img: '📖', type: 'object' }
                ]
            };
            localStorage.setItem('caa_pictograms', JSON.stringify(defaultPictograms));
        }
    }

    getCategories() {
        return JSON.parse(localStorage.getItem('caa_categories')) || [];
    }

    getPictogramsByCategory(categoryId) {
        const allPictos = JSON.parse(localStorage.getItem('caa_pictograms')) || {};
        return allPictos[categoryId] || [];
    }

    // Guarda los nuevos pictogramas agregados desde la interfaz de Ajustes
    saveCustomWord(word) {
        const allPictos = JSON.parse(localStorage.getItem('caa_pictograms')) || {};
        if (!allPictos[word.category]) {
            allPictos[word.category] = [];
        }
        allPictos[word.category].push({
            text: word.text,
            img: word.img,
            type: word.type
        });
        localStorage.setItem('caa_pictograms', JSON.stringify(allPictos));
    }

    // Permite a un nuevo módulo registrar una categoría y sus palabras dinámicamente
    registerExternalModule(moduleId, moduleName, moduleIcon, pictogramsArray) {
        // 1. Registrar Categoría si no existe
        let categories = this.getCategories();
        if (!categories.some(c => c.id === moduleId)) {
            categories.push({ id: moduleId, name: moduleName, icon: moduleIcon });
            localStorage.setItem('caa_categories', JSON.stringify(categories));
        }

        // 2. Registrar sus Pictogramas
        let allPictos = JSON.parse(localStorage.getItem('caa_pictograms')) || {};
        allPictos[moduleId] = pictogramsArray;
        localStorage.setItem('caa_pictograms', JSON.stringify(allPictos));
    }
}

window.appStorage = new AppStorage();