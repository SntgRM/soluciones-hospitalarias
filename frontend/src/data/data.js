import { iconsImgs, personsImgs } from '../utils/images'; 

export const navigationLinks_bodega = [
    {
        id: 1,
        title: 'Inicio',
        image: iconsImgs.house, 
        path: '/'
    },
    {
        id: 2,
        title: 'Registro',
        image: iconsImgs.bookText,
        path: '/registro'
    },
    {
        id: 3,
        title: 'Historial',
        image: iconsImgs.folder,
        path: '/historial'
    },
    {
        id: 4,
        title: 'Transportadora',
        image: iconsImgs.truck,
        path: '/transportadora'
    },
    
];

export const navigationLinks_ventas = [
    {
        id: 1,
        title: '#',
        image: iconsImgs.house, 
        path: '/notFound'
    },
    {
        id: 2,
        title: '#',
        image: iconsImgs.bookText,
        path: '/notFound'
    },
];

export const navigationLinks_admin = [
    {
        id: 1,
        title: 'Usuario',
        image: iconsImgs.user, 
        path: './usuario'
    },
    {
        id: 2,
        title: 'Ayuda',
        image: iconsImgs.info,
        path: './ayuda'
    },
    {
        id: 3,
        title: 'Salir',
        image: iconsImgs.door,
        path: '/login'
    },
    // ... otros enlaces de navegación
];


// Exportación de reportData
export const reportData = [
    {
        id: 1,
        name: "Servicios",
        value: 40,
        color: "#4CAF50"
    },
    {
        id: 2,
        name: "Productos",
        value: 30,
        color: "#2196F3"
    },
    {
        id: 3,
        name: "Marketing",
        value: 20,
        color: "#FF9800"
    },
    {
        id: 4,
        name: "Otros",
        value: 10,
        color: "#F44336"
    }
];

// Exportación de budget
export const budget = [
    {
        id: 1,
        title: "Entretenimiento",
        type: "Mensual",
        amount: 300.00
    },
    {
        id: 2,
        title: "Comida",
        type: "Mensual",
        amount: 500.00
    },
    {
        id: 3,
        title: "Transporte",
        type: "Mensual",
        amount: 150.00
    },
    {
        id: 4,
        title: "Servicios Públicos",
        type: "Mensual",
        amount: 200.00
    }
];

// Exportación de subscriptions
export const subscriptions = [
    {
        id: 1,
        title: "Netflix",
        amount: 15.99,
        period: "Mensual",
        icon: iconsImgs.netflix 
    },
    {
        id: 2,
        title: "Spotify Premium",
        amount: 9.99,
        period: "Mensual",
        icon: iconsImgs.spotify 
    },
    {
        id: 3,
        title: "Amazon Prime",
        amount: 12.99,
        period: "Anual",
        icon: iconsImgs.amazon 
    },
];

// ¡NUEVA EXPORTACIÓN REQUERIDA POR Savings.jsx!
// Asegúrate de que esta estructura de datos coincida con lo que Savings.jsx espera
export const savings = [
    {
        id: 1,
        title: "Fondo de Emergencia",
        currentAmount: 5000,
        goal: 10000,
        icon: iconsImgs.saving // Ejemplo de icono
    },
    {
        id: 2,
        title: "Vacaciones",
        currentAmount: 1200,
        goal: 3000,
        icon: iconsImgs.travel // Ejemplo de icono
    }
    // ... más datos de ahorro
];

// EJEMPLOS DE OTRAS EXPORTACIONES QUE PODRÍAS NECESITAR (si tus componentes los usan)
// ¡NUEVA EXPORTACIÓN PARA LOS DATOS DEL GRÁFICO DE BARRAS EN CARDS.JSX!
export const cardsChartData = [
    {
        id: 1,
        label: "Enero",
        value: 75,
        color: "#28a745" // Verde
    },
    {
        id: 2,
        label: "Febrero",
        value: 80,
        color: "#007bff" // Azul
    },
    {
        id: 3,
        label: "Marzo",
        value: 60,
        color: "#ffc107" // Naranja
    },
    {
        id: 4,
        label: "Abril",
        value: 90,
        color: "#28a745" // Verde
    },
    {
        id: 5,
        label: "Mayo",
        value: 70,
        color: "#007bff" // Azul
    },
    {
        id: 6,
        label: "Junio",
        value: 85,
        color: "#ffc107" // Naranja
    },
    {
        id: 7,
        label: "Julio",
        value: 95,
        color: "#28a745" // Verde
    },
    {
        id: 8,
        label: "Agosto",
        value: 78,
        color: "#007bff" // Azul
    },
    {
        id: 9,
        label: "Septiembre",
        value: 65,
        color: "#ffc107" // Naranja
    },
    {
        id: 10,
        label: "Octubre",
        value: 88,
        color: "#28a745" // Verde
    },
    {
        id: 11,
        label: "Noviembre",
        value: 72,
        color: "#007bff" // Azul
    },
    {
        id: 12,
        label: "Diciembre",
        value: 92,
        color: "#ffc107" // Naranja
    }
];

export const financialData = [
    {
        id: 1,
        title: "Inversiones",
        value: 12500,
        gainLoss: "+5%",
        icon: iconsImgs.chart 
    },
];

export const loansData = [
    {
        id: 1,
        title: "Préstamo Personal",
        amount: 8000,
        paid: 2000,
        dueDate: "2026-06-30",
        icon: iconsImgs.loan 
    },
];

// src/data/data.js

// ... (todas tus importaciones y exportaciones anteriores como navigationLinks, transactions, reportData, budget, subscriptions, savings, cardsChartData, loansData, financialData)

// ¡NUEVA EXPORTACIÓN PARA LOS DATOS DE PRODUCTOS!
export const productsData = [
    {
        id: 1,
        name: "Acetaminofén (500mg)",
        description: "Analgésico y antipirético para el alivio del dolor leve a moderado y la fiebre.",
        quantity: 2,
        orderDate: "2025-07-01",
        dispatchDate: "2025-07-03",
        deliveryDate: "2025-07-05",
        status: "entregado al cliente", // <-- Nuevo estado
        image: "https://via.placeholder.com/150/007bff/FFFFFF?text=Acetaminofen"
    },
    {
        id: 2,
        name: "Ibuprofeno (400mg)",
        description: "Antiinflamatorio no esteroideo (AINE) para el dolor, la inflamación y la fiebre.",
        quantity: 1,
        orderDate: "2025-07-05",
        dispatchDate: "2025-07-06",
        deliveryDate: null,
        status: "empacado", // <-- Nuevo estado (ya existía pero lo mantenemos)
        image: "https://via.placeholder.com/150/28a745/FFFFFF?text=Ibuprofeno"
    },
    {
        id: 3,
        name: "Amoxicilina (500mg) - Blíster",
        description: "Antibiótico de amplio espectro para tratar diversas infecciones bacterianas.",
        quantity: 3,
        orderDate: "2025-07-10",
        dispatchDate: null,
        deliveryDate: null,
        status: "en alistamiento", // <-- Nuevo estado
        image: "https://via.placeholder.com/150/ffc107/FFFFFF?text=Amoxicilina"
    },
    {
        id: 4,
        name: "Vitamina C (1000mg) - Efervescente",
        description: "Suplemento vitamínico que contribuye al funcionamiento normal del sistema inmunitario.",
        quantity: 1,
        orderDate: "2025-06-25",
        dispatchDate: "2025-06-26",
        deliveryDate: "2025-06-28",
        status: "entregado al cliente", // <-- Nuevo estado
        image: "https://via.placeholder.com/150/dc3545/FFFFFF?text=VitaminaC"
    },
    {
        id: 5,
        name: "Omeprazol (20mg)",
        description: "Medicamento para reducir la producción de ácido en el estómago, útil para la acidez.",
        quantity: 1,
        orderDate: "2025-07-12",
        dispatchDate: "2025-07-13",
        deliveryDate: null,
        status: "en preparación", // <-- Nuevo estado
        image: "https://via.placeholder.com/150/6610f2/FFFFFF?text=Omeprazol"
    },
    {
        id: 6,
        name: "Sales de Rehidratación Oral (SRO)",
        description: "Preparado para prevenir y tratar la deshidratación causada por diarrea.",
        quantity: 5,
        orderDate: "2025-07-15",
        dispatchDate: null,
        deliveryDate: null,
        status: "en alistamiento", // <-- Nuevo estado
        image: "https://via.placeholder.com/150/20c997/FFFFFF?text=SRO"
    },
    {
        id: 7,
        name: "Antihistamínico (Loratadina)",
        description: "Alivia los síntomas de la alergia como estornudos, picazón y secreción nasal.",
        quantity: 1,
        orderDate: "2025-07-16",
        dispatchDate: "2025-07-17",
        deliveryDate: null,
        status: "en reparto", // <-- Nuevo estado
        image: "https://via.placeholder.com/150/fd7e14/FFFFFF?text=Antihistaminico"
    },
    {
        id: 8,
        name: "Parches para el Dolor Muscular",
        description: "Parches autoadhesivos para alivio localizado del dolor muscular y articular.",
        quantity: 1,
        orderDate: "2025-07-14",
        dispatchDate: "2025-07-15",
        deliveryDate: "2025-07-16",
        status: "enviado en transportadora", // <-- Nuevo estado
        image: "https://via.placeholder.com/150/6f42c1/FFFFFF?text=ParchesDolor"
    },
    {
        id: 9,
        name: "Termómetro Digital",
        description: "Termómetro de lectura rápida y precisa para medir la temperatura corporal.",
        quantity: 1,
        orderDate: "2025-07-18",
        dispatchDate: null,
        deliveryDate: null,
        status: "pedido no recibido", // <-- Nuevo estado
        image: "https://via.placeholder.com/150/800080/FFFFFF?text=Termometro"
    },
    {
        id: 10,
        name: "Gel Antibacterial",
        description: "Gel desinfectante para manos, elimina el 99.9% de gérmenes.",
        quantity: 2,
        orderDate: "2025-07-19",
        dispatchDate: null,
        deliveryDate: null,
        status: "anulado", // <-- Nuevo estado
        image: "https://via.placeholder.com/150/FFD700/FFFFFF?text=Gel"
    },
    {
        id: 11,
        name: "Vendas Elásticas",
        description: "Vendas elásticas para soporte y compresión en esguinces y torceduras.",
        quantity: 3,
        orderDate: "2025-07-20",
        dispatchDate: "2025-07-21",
        deliveryDate: null,
        status: "enviado al cliente", // <-- Nuevo estado
        image: "https://via.placeholder.com/150/00CED1/FFFFFF?text=Vendas"
    },
];