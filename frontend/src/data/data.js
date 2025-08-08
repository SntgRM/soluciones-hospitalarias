// import { iconsImgs } from "../utils/images";

import {
  Home,
  Folder,
  Truck,
  AreaChart,
  ScrollText,
  BookText,
  User,
  Info,
  Warehouse,
  CircleHelp,
  LayoutDashboard
} from "lucide-react";


export const navigationLinks_bodega = [
  {
    id: 1,
    title: "Gestión",
    icon: Home,
    path: "/home",
  },
  {
    id: 2,
    title: "Historial",
    icon: Folder,
    path: "/historial",
  },
  {
    id: 3,
    title: "Transportadora",
    icon: Truck,
    path: "/transportadora",
  },
  {
    id: 4,
    title: "Dashboard",
    icon: AreaChart,
    path: "/dashboard",
  },
  {
    id: 5,
    title: "PQR",
    icon: ScrollText,
    path: "/pqr",
  },
];

export const navigationLinks_ventas = [
  {
    id: 1,
    title: "#",
    icon: Home, // Era iconsImgs.house
    path: "/notFound",
  },
  {
    id: 2,
    title: "#",
    icon: BookText, // Era iconsImgs.bookText
    path: "/notFound",
  },
];

export const navigationLinks_admin = [
  {
    id: 1,
    title: "Usuarios",
    icon: User, // Era iconsImgs.user
    path: "./usuarios",
  },
  {
    id: 2,
    title: "Ayuda",
    icon: Info, // Era iconsImgs.info
    path: "./ayuda",
  },
];

export const inicioLink = {
  id: 1,
  title: "Inicio",
  icon: Home,
  path: "./",
};

export const topContent = [
  {
    id: 1,
    title: 'Soluciones Hospitalarias de la Costa S.A.S',
    description: 'Un mundo de Soluciones - Sistema de Gestión Integral.',
    icon: Home,
  },
  {
    id: 2,
    title: 'Bodega',
    description: 'Panel de control y gestión de bodega.',
    icon: Warehouse,
  },
  {
    id: 3, 
    title: 'Transportadora',
    description: 'Administra y controla las transportadoras registradas.',
    icon: Truck,
  },
  {
    id: 4,
    title: 'Usuarios',
    description: 'Administra los usuarios del sistema.',
    icon: User,
  },
  {
    id: 5,
    title: 'Centro de ayuda',
    description: 'Encuentra respuestas a las preguntas más frecuentes.',
    icon: CircleHelp,
  },
  {
    id: 6,
    title: 'Historial de Productos',
    description: 'Visualiza todos los eventos registrados para cada producto del sistema.',
    icon: CircleHelp,
  },
  {
    id: 7,
    title: 'Panel de Bodega',
    description: 'Análisis integral del movimiento y rendimiento de productos en bodega.',
    icon: LayoutDashboard,
  }
];