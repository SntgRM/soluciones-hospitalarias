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
        title: 'Historial',
        image: iconsImgs.folder,
        path: '/historial'
    },
    {
        id: 3,
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
        title: 'Usuarios',
        image: iconsImgs.user, 
        path: './usuarios'
    },
    {
        id: 2,
        title: 'Ayuda',
        image: iconsImgs.info,
        path: './ayuda'
    },
    
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
