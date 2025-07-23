"use client"

import { useState, useEffect } from "react"
import "./User.css"
import {
  Users,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  Filter,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  CheckCircle,
  AlertCircle,
  UserIcon,
  Building,
  Hash,
} from "lucide-react"

// Datos de ejemplo
const initialUsers = [
  {
    id: 1,
    nombre: "María García",
    email: "maria.garcia@farmacia.com",
    telefono: "+57 300 123 4567",
    rol: "administrador",
    estado: "activo",
    fechaCreacion: "2024-01-15",
    ultimoAcceso: "2024-07-17 10:30 AM",
    direccion: "Calle 123 #45-67, Bogotá",
    departamento: "Administración",
  },
  {
    id: 2,
    nombre: "Juan Pérez",
    email: "juan.perez@farmacia.com",
    telefono: "+57 301 234 5678",
    rol: "farmaceutico",
    estado: "activo",
    fechaCreacion: "2024-02-20",
    ultimoAcceso: "2024-07-17 09:15 AM",
    direccion: "Carrera 45 #12-34, Medellín",
    departamento: "Farmacia",
  },
  {
    id: 3,
    nombre: "Ana Fernández",
    email: "ana.fernandez@farmacia.com",
    telefono: "+57 302 345 6789",
    rol: "vendedor",
    estado: "inactivo",
    fechaCreacion: "2024-03-10",
    ultimoAcceso: "2024-07-15 02:45 PM",
    direccion: "Avenida 80 #23-45, Cali",
    departamento: "Ventas",
  },
  {
    id: 4,
    nombre: "Carlos Rodríguez",
    email: "carlos.rodriguez@farmacia.com",
    telefono: "+57 303 456 7890",
    rol: "inventario",
    estado: "activo",
    fechaCreacion: "2024-04-05",
    ultimoAcceso: "2024-07-16 04:20 PM",
    direccion: "Calle 67 #89-12, Barranquilla",
    departamento: "Inventario",
  },
  {
    id: 5,
    nombre: "Laura Martínez",
    email: "laura.martinez@farmacia.com",
    telefono: "+57 304 567 8901",
    rol: "farmaceutico",
    estado: "activo",
    fechaCreacion: "2024-05-12",
    ultimoAcceso: "2024-07-17 08:00 AM",
    direccion: "Transversal 34 #56-78, Bucaramanga",
    departamento: "Farmacia",
  },
]

const roles = [
  { value: "administrador", label: "Administrador", color: "#ef4444" },
  { value: "farmaceutico", label: "Farmacéutico", color: "#3b82f6" },
  { value: "vendedor", label: "Vendedor", color: "#10b981" },
  { value: "inventario", label: "Inventario", color: "#f59e0b" },
]

const departamentos = ["Administración", "Farmacia", "Ventas", "Inventario", "Recursos Humanos", "Contabilidad"]

function User() {
  const [users, setUsers] = useState(initialUsers)
  const [filteredUsers, setFilteredUsers] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("todos")
  const [filterStatus, setFilterStatus] = useState("todos")
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState("create") // create, edit, view
  const [selectedUser, setSelectedUser] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    rol: "vendedor",
    estado: "activo",
    direccion: "",
    departamento: "",
    password: "",
  })

  // Filtrar usuarios
  useEffect(() => {
    const filtered = users.filter((user) => {
      const matchesSearch =
        user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.telefono.includes(searchTerm)

      const matchesRole = filterRole === "todos" || user.rol === filterRole
      const matchesStatus = filterStatus === "todos" || user.estado === filterStatus

      return matchesSearch && matchesRole && matchesStatus
    })

    setFilteredUsers(filtered)
  }, [users, searchTerm, filterRole, filterStatus])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      rol: "vendedor",
      estado: "activo",
      direccion: "",
      departamento: "",
      password: "",
    })
  }

  const openModal = (mode, user = null) => {
    setModalMode(mode)
    setSelectedUser(user)
    setShowModal(true)

    if (mode === "edit" && user) {
      setFormData({
        nombre: user.nombre.split(" ")[0] || "",
        apellido: user.nombre.split(" ").slice(1).join(" ") || "",
        email: user.email,
        telefono: user.telefono,
        rol: user.rol,
        estado: user.estado,
        direccion: user.direccion,
        departamento: user.departamento,
        password: "",
      })
    } else if (mode === "create") {
      resetForm()
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedUser(null)
    resetForm()
    setShowPassword(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simular API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (modalMode === "create") {
      const newUser = {
        id: Date.now(),
        ...formData,
        nombre: `${formData.nombre} ${formData.apellido}`.trim(),
        fechaCreacion: new Date().toISOString().split("T")[0],
        ultimoAcceso: "Nunca",
      }
      setUsers((prev) => [...prev, newUser])
    } else if (modalMode === "edit") {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                ...formData,
                nombre: `${formData.nombre} ${formData.apellido}`.trim(),
              }
            : user,
        ),
      )
    }

    setIsSubmitting(false)
    closeModal()
  }

  const handleDelete = (user) => {
    setUserToDelete(user)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    setIsSubmitting(true)

    // Simular API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    setUsers((prev) => prev.filter((user) => user.id !== userToDelete.id))
    setShowDeleteConfirm(false)
    setUserToDelete(null)
    setIsSubmitting(false)
  }

  const getRoleColor = (role) => {
    const roleObj = roles.find((r) => r.value === role)
    return roleObj ? roleObj.color : "#6b7280"
  }

  const getRoleLabel = (role) => {
    const roleObj = roles.find((r) => r.value === role)
    return roleObj ? roleObj.label : role
  }

  const getStatusColor = (status) => {
    return status === "activo" ? "#10b981" : "#ef4444"
  }

  return (
    <div className="user-management-container">
      {/* Header */}
      <div className="user-management-header">
        <div className="user-header-title-section">
          <div className="user-header-icon">
            <Users size={32} />
          </div>
          <div>
            <h2 className="user-page-title">Gestión de Usuarios</h2>
            <p className="user-page-subtitle">Administra los usuarios del sistema</p>
          </div>
        </div>

        <button className="user-btn-primary" onClick={() => openModal("create")}>
          <UserPlus size={18} />
          Nuevo Usuario
        </button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="user-filters-section">
        <div className="user-search-box">
          <Search size={18} className="user-search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="user-search-input"
          />
        </div>

        <div className="user-filters-group">
          <div className="user-filter-item">
            <Filter size={16} />
            <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="user-filter-select">
              <option value="todos">Todos los roles</option>
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          <div className="user-filter-item">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="user-filter-select"
            >
              <option value="todos">Todos los estados</option>
              <option value="activo">Activos</option>
              <option value="inactivo">Inactivos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="user-stats-grid">
        <div className="user-stat-card">
          <div className="user-stat-icon user-stat-total">
            <Users size={24} />
          </div>
          <div className="user-stat-content">
            <span className="user-stat-number">{users.length}</span>
            <span className="user-stat-label">Total Usuarios</span>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="user-stat-icon user-stat-active">
            <CheckCircle size={24} />
          </div>
          <div className="user-stat-content">
            <span className="user-stat-number">{users.filter((u) => u.estado === "activo").length}</span>
            <span className="user-stat-label">Usuarios Activos</span>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="user-stat-icon user-stat-inactive">
            <AlertCircle size={24} />
          </div>
          <div className="user-stat-content">
            <span className="user-stat-number">{users.filter((u) => u.estado === "inactivo").length}</span>
            <span className="user-stat-label">Usuarios Inactivos</span>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="user-stat-icon user-stat-admins">
            <Shield size={24} />
          </div>
          <div className="user-stat-content">
            <span className="user-stat-number">{users.filter((u) => u.rol === "administrador").length}</span>
            <span className="user-stat-label">Administradores</span>
          </div>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="user-table-container">
        <div className="user-table-header">
          <h3>Lista de Usuarios ({filteredUsers.length})</h3>
        </div>

        {filteredUsers.length > 0 ? (
          <div className="user-grid">
            {filteredUsers.map((user) => (
              <div key={user.id} className="user-card">
                <div className="user-card-header">
                  <div className="user-avatar">
                    <UserIcon size={24} />
                  </div>
                  <div className="user-basic-info">
                    <h4 className="user-name">{user.nombre}</h4>
                    <p className="user-email">{user.email}</p>
                  </div>
                  <div className="user-actions">
                    <button
                      className="user-action-btn user-action-view"
                      onClick={() => openModal("view", user)}
                      title="Ver detalles"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="user-action-btn user-action-edit"
                      onClick={() => openModal("edit", user)}
                      title="Editar usuario"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="user-action-btn user-action-delete"
                      onClick={() => handleDelete(user)}
                      title="Eliminar usuario"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="user-card-body">
                  <div className="user-info-row">
                    <Phone size={14} />
                    <span>{user.telefono}</span>
                  </div>
                  <div className="user-info-row">
                    <Building size={14} />
                    <span>{user.departamento}</span>
                  </div>
                  <div className="user-info-row">
                    <Calendar size={14} />
                    <span>Último acceso: {user.ultimoAcceso}</span>
                  </div>
                </div>

                <div className="user-card-footer">
                  <div
                    className="user-role-badge"
                    style={{ backgroundColor: `${getRoleColor(user.rol)}15`, color: getRoleColor(user.rol) }}
                  >
                    <Shield size={12} />
                    {getRoleLabel(user.rol)}
                  </div>
                  <div
                    className="user-status-badge"
                    style={{ backgroundColor: `${getStatusColor(user.estado)}15`, color: getStatusColor(user.estado) }}
                  >
                    {user.estado === "activo" ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                    {user.estado === "activo" ? "Activo" : "Inactivo"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="user-no-results">
            <Users size={64} />
            <h3>No se encontraron usuarios</h3>
            <p>No hay usuarios que coincidan con los filtros seleccionados.</p>
            <button
              className="user-btn-secondary"
              onClick={() => {
                setSearchTerm("")
                setFilterRole("todos")
                setFilterStatus("todos")
              }}
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="user-modal-overlay" onClick={closeModal}>
          <div className="user-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="user-modal-header">
              <h3>
                {modalMode === "create" && "Crear Nuevo Usuario"}
                {modalMode === "edit" && "Editar Usuario"}
                {modalMode === "view" && "Detalles del Usuario"}
              </h3>
              <button className="user-modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <div className="user-modal-body">
              {modalMode === "view" ? (
                <div className="user-details">
                  <div className="user-detail-section">
                    <h4>Información Personal</h4>
                    <div className="user-detail-grid">
                      <div className="user-detail-item">
                        <UserIcon size={16} />
                        <span className="user-detail-label">Nombre:</span>
                        <span className="user-detail-value">{selectedUser.nombre}</span>
                      </div>
                      <div className="user-detail-item">
                        <Mail size={16} />
                        <span className="user-detail-label">Email:</span>
                        <span className="user-detail-value">{selectedUser.email}</span>
                      </div>
                      <div className="user-detail-item">
                        <Phone size={16} />
                        <span className="user-detail-label">Teléfono:</span>
                        <span className="user-detail-value">{selectedUser.telefono}</span>
                      </div>
                      <div className="user-detail-item">
                        <MapPin size={16} />
                        <span className="user-detail-label">Dirección:</span>
                        <span className="user-detail-value">{selectedUser.direccion}</span>
                      </div>
                    </div>
                  </div>

                  <div className="user-detail-section">
                    <h4>Información Laboral</h4>
                    <div className="user-detail-grid">
                      <div className="user-detail-item">
                        <Shield size={16} />
                        <span className="user-detail-label">Rol:</span>
                        <span className="user-detail-value">{getRoleLabel(selectedUser.rol)}</span>
                      </div>
                      <div className="user-detail-item">
                        <Building size={16} />
                        <span className="user-detail-label">Departamento:</span>
                        <span className="user-detail-value">{selectedUser.departamento}</span>
                      </div>
                      <div className="user-detail-item">
                        <CheckCircle size={16} />
                        <span className="user-detail-label">Estado:</span>
                        <span className="user-detail-value">
                          {selectedUser.estado === "activo" ? "Activo" : "Inactivo"}
                        </span>
                      </div>
                      <div className="user-detail-item">
                        <Calendar size={16} />
                        <span className="user-detail-label">Fecha de creación:</span>
                        <span className="user-detail-value">{selectedUser.fechaCreacion}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="user-form">
                  <div className="user-form-grid">
                    <div className="user-form-group">
                      <label className="user-form-label">
                        <UserIcon size={16} />
                        Nombre *
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        required
                        className="user-form-input"
                        placeholder="Ingrese el nombre"
                      />
                    </div>

                    <div className="user-form-group">
                      <label className="user-form-label">
                        <UserIcon size={16} />
                        Apellido *
                      </label>
                      <input
                        type="text"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleInputChange}
                        required
                        className="user-form-input"
                        placeholder="Ingrese el apellido"
                      />
                    </div>

                    <div className="user-form-group">
                      <label className="user-form-label">
                        <Shield size={16} />
                        Rol *
                      </label>
                      <select
                        name="rol"
                        value={formData.rol}
                        onChange={handleInputChange}
                        required
                        className="user-form-select"
                      >
                        {roles.map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                    </div>


                    {modalMode === "create" && (
                      <div className="user-form-group user-form-full-width">
                        <label className="user-form-label">
                          <Hash size={16} />
                          Contraseña temporal *
                        </label>
                        <div className="user-password-input">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            className="user-form-input"
                            placeholder="Contraseña temporal"
                          />
                          <button
                            type="button"
                            className="user-password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="user-form-actions">
                    <button type="button" className="user-btn-secondary" onClick={closeModal}>
                      Cancelar
                    </button>
                    <button type="submit" className="user-btn-primary" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="user-loading-spinner"></div>
                          {modalMode === "create" ? "Creando..." : "Guardando..."}
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          {modalMode === "create" ? "Crear Usuario" : "Guardar Cambios"}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="user-modal-overlay">
          <div className="user-modal-content user-delete-modal">
            <div className="user-delete-modal-header">
              <div className="user-delete-icon">
                <Trash2 size={32} />
              </div>
              <h3>Confirmar Eliminación</h3>
            </div>
            <div className="user-delete-modal-body">
              <p>
                ¿Estás seguro de que deseas eliminar al usuario <strong>{userToDelete?.nombre}</strong>?
              </p>
              <p className="user-delete-warning">Esta acción no se puede deshacer.</p>
            </div>
            <div className="user-delete-modal-actions">
              <button
                className="user-btn-secondary"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button className="user-btn-danger" onClick={confirmDelete} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="user-loading-spinner"></div>
                    Eliminando...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Eliminar Usuario
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default User
