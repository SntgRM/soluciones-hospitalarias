"use client"

import { useState, useEffect } from "react"
import "./User.css"
import { topContent } from "../../data/data.js";
import * as LucideIcons from 'lucide-react';
import { personsImgs } from "../../utils/images"
import DashboardHeader from "../../components/titleContent/titleContent.jsx";
import {
  AlertTriangle,
  AtSign,
  BadgeDollarSign,
  Calendar,
  Crown,
  Edit,
  Edit3,
  Eye,
  EyeOff,
  Filter,
  Lock,
  Mail,
  Save,
  Search,
  Shield,
  Trash2,
  UserIcon,
  UserPlus,
  Users,
  Warehouse,
  X,
} from "lucide-react"
import { getUsers, deleteUser, createUserWithFile, updateUserWithFile } from "../../services/api"

const roles = [
  { value: "administrador", label: "Administrador", color: "#f59e0b" },
  { value: "bodega", label: "Bodega", color: "#3b82f6" },
  { value: "ventas", label: "Ventas", color: "#ef4444" },
]

function User() {
  const headerData = topContent[3] || {
    title: 'Gestión de Usuarios',
    description: 'Panel de control de usuarios del sistema',
    iconName: 'Users'
  }
  const IconComponent = LucideIcons[topContent[3].iconName];
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("todos")
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState("create")
  const [selectedUser, setSelectedUser] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    email: "",
    role: "ventas",
    password: "",
    image: null,
  })

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers()
        setUsers(data)
        setFilteredUsers(data)
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }
    fetchUsers()
  }, [])

  // Filtrar usuarios
  useEffect(() => {
    const filtered = users.filter((user) => {
      const matchesSearch = user.first_name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRole = filterRole === "todos" || user.role === filterRole

      return matchesSearch && matchesRole
    })

    setFilteredUsers(filtered)
  }, [users, searchTerm, filterRole])

  const handleInputChange = (e) => {
    const { name, value } = e.target

    let formattedValue = value

    if (name === "first_name") {
      formattedValue = value.toUpperCase()
    } else if (name === "username") {
      formattedValue = value.toLowerCase()
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }))
  }

  const handleImageChange = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        if (!file.type.startsWith("image/")) {
          alert("Por favor selecciona un archivo de imagen válido")
          return
        }

        if (file.size > 5 * 1024 * 1024) {
          alert("La imagen debe ser menor a 5MB")
          return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
          const imageDataURL = e.target.result
          setSelectedImage(imageDataURL)
          setFormData((prev) => ({
            ...prev,
            image: imageDataURL,
          }))
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const resetForm = () => {
    setFormData({
      username: "",
      first_name: "",
      email: "",
      role: "bodega",
      password: "",
      image: null,
    })
    setSelectedImage(null)
  }

  const openModal = (mode, user = null) => {
    setModalMode(mode)
    setSelectedUser(user)
    setShowModal(true)

    if (mode === "edit" && user) {
      setFormData({
        username: user.username || "",
        first_name: user.first_name,
        email: user.email || "",
        role: user.role,
        image: null,
      })
      setSelectedImage(user.profile_image_url || null)
    } else if (mode === "create") {
      resetForm()
    } else if (mode === "view" && user) {
      setSelectedUser(user)
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

    try {
      const form = new FormData()
      for (const key in formData) {
        if (formData[key] !== null && formData[key] !== undefined) {
          form.append(key, formData[key])
        }
      }

      if (modalMode === "create") {
        const newUser = await createUserWithFile(form)
        window.location.reload()
        const updatedUsers = await getUsers()
        setUsers(updatedUsers)
        setFilteredUsers(updatedUsers)
      } else if (modalMode === "edit") {
        const updatedUser = await updateUserWithFile(selectedUser.id, form)
        window.location.reload()
        const updatedUsers = await getUsers()
        setUsers(updatedUsers)
        setFilteredUsers(updatedUsers)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      console.error("Error details:", error.response?.data)
      alert("Error al procesar la solicitud. Por favor intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
      closeModal()
    }
  }

  const handleDelete = (user) => {
    setUserToDelete(user)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    setIsSubmitting(true)

    try {
      await deleteUser(userToDelete.id)
      setUsers((prev) => prev.filter((user) => user.id !== userToDelete.id))
      window.location.reload()
    } catch (error) {
      console.error("Error deleting user:", error)
    } finally {
      setShowDeleteConfirm(false)
      setUserToDelete(null)
      setIsSubmitting(false)
    }
  }

  const getRoleColor = (role) => {
    const roleObj = roles.find((r) => r.value === role)
    return roleObj ? roleObj.color : "#6b7280"
  }

  const getRoleLabel = (role) => {
    const roleObj = roles.find((r) => r.value === role)
    return roleObj ? roleObj.label : role
  }

  const handleImageError = (e) => {
    e.target.src = personsImgs.ISOTIPO
  }

  return (
    <div className="user-management-container">
      {/* Header de Bienvenida */}
      <DashboardHeader icon={topContent[3].icon} title={topContent[3].title} description={topContent[3].description} />
        <button className="user-btn-primary" onClick={() => openModal("create")}>
          <UserPlus size={18} />
          <span>Nuevo Usuario</span>
        </button>

      {/* Filtros y búsqueda */}
      <div className="user-filters-section">
        <div className="user-search-box">
          <Search size={18} className="user-search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre..."
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
          <div className="user-stat-icon user-stat-admins">
            <Crown size={24} />
          </div>
          <div className="user-stat-content">
            <span className="user-stat-number">{users.filter((u) => u.role === "administrador").length}</span>
            <span className="user-stat-label">Administradores</span>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="user-stat-icon user-stat-warehouse">
            <Warehouse size={24} />
          </div>
          <div className="user-stat-content">
            <span className="user-stat-number">{users.filter((u) => u.role === "bodega").length}</span>
            <span className="user-stat-label">Bodega</span>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="user-stat-icon user-stat-sales">
            <BadgeDollarSign size={24} />
          </div>
          <div className="user-stat-content">
            <span className="user-stat-number">{users.filter((u) => u.role === "ventas").length}</span>
            <span className="user-stat-label">Ventas</span>
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
                  <div className="user-profile-img">
                    <img
                      src={user.profile_image_url || personsImgs.ISOTIPO}
                      alt={user.first_name}
                      onError={handleImageError}
                      className="user-avatar"
                      style={{}}
                    />
                  </div>
                  <div className="user-basic-info">
                    <h4 className="user-name">{`${user.first_name}`}</h4>
                    <p className="user-username">@{user.username}</p>
                  </div>
                  {/* Botones para pantallas grandes */}
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

                <div className="user-card-footer">
                  <div
                    className="user-role-badge"
                    style={{
                      backgroundColor: `${getRoleColor(user.role)}15`,
                      color: getRoleColor(user.role),
                    }}
                  >
                    <Shield size={12} />
                    {getRoleLabel(user.role)}
                  </div>

                  {/* Botones para móviles */}
                  <div className="user-actions-mobile">
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
              </div>
            ))}
          </div>
        ) : (
          <div className="user-no-results">
            <Users size={64} />
            <h3>No se encontraron usuarios</h3>
            <p>No hay usuarios que coincidan con los filtros seleccionados.</p>
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
                    {/* Imagen del usuario en vista */}
                    <div className="user-img-container" style={{ marginBottom: "20px" }}>
                      <img
                        className="user-img-mod"
                        src={selectedUser?.profile_image_url || personsImgs.ISOTIPO}
                        alt="Usuario"
                        onError={handleImageError}
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <h4>Información Personal</h4>
                    <div className="user-detail-grid">
                      <div className="user-detail-item">
                        <UserIcon size={16} />
                        <span className="user-detail-label">Nombre:</span>
                        <span className="user-detail-value">{`${selectedUser.first_name}`}</span>
                      </div>
                      <div className="user-detail-item">
                        <AtSign size={16} />
                        <span className="user-detail-label">Nombre de Usuario:</span>
                        <span className="user-detail-value">{selectedUser.username}</span>
                      </div>
                      <div className="user-detail-item">
                        <Mail size={16} />
                        <span className="user-detail-label">Email:</span>
                        <span className="user-detail-value">{selectedUser.email}</span>
                      </div>
                      <div className="user-detail-item">
                        <Shield size={16} />
                        <span className="user-detail-label">Rol:</span>
                        <span className="user-detail-value">{getRoleLabel(selectedUser.role)}</span>
                      </div>
                      <div className="user-detail-item">
                        <Calendar size={16} />
                        <span className="user-detail-label">Fecha de creación:</span>
                        <span className="user-detail-value">
                          {new Date(selectedUser.date_joined).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="user-form">
                  {/* Imagen del usuario centrada */}
                  <div className="user-img-container">
                    <img
                      className="user-img-mod"
                      src={
                        selectedImage ||
                        personsImgs.ISOTIPO ||
                        "/placeholder.svg?height=70&width=70" ||
                        "/placeholder.svg" ||
                        "/placeholder.svg"
                      }
                      alt="Usuario"
                      onError={handleImageError}
                    />
                    <button
                      type="button"
                      className="user-img-edit-btn"
                      onClick={handleImageChange}
                      title="Cambiar imagen"
                    >
                      <Edit3 size={14} />
                    </button>
                  </div>

                  {/* Grid del formulario reorganizado */}
                  <div className="user-form-grid-custom">
                    {/* Columna Izquierda */}
                    <div className="user-form-column-left">
                      <div className="user-form-group">
                        <label className="user-form-label">
                          <UserIcon size={16} />
                          Nombre Completo *
                        </label>
                        <input
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          required
                          className="user-form-input"
                          placeholder="Ingrese el nombre completo"
                        />
                      </div>

                      <div className="user-form-group">
                        <label className="user-form-label">
                          <Shield size={16} />
                          Rol *
                        </label>
                        <select
                          name="role"
                          value={formData.role}
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
                    </div>

                    {/* Columna Derecha */}
                    <div className="user-form-column-right">
                      <div className="user-form-group">
                        <label className="user-form-label">
                          <AtSign size={16} />
                          Nombre de Usuario *
                        </label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          required
                          className="user-form-input"
                          placeholder="Ingrese un nombre de usuario"
                        />
                      </div>

                      <div className="user-form-group">
                        <label className="user-form-label">
                          <Mail size={16} />
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="user-form-input"
                          placeholder="Ingrese un email"
                        />
                      </div>

                      {modalMode === "create" && (
                        <div className="user-form-group">
                          <label className="user-form-label">
                            <Lock size={16} />
                            Contraseña *
                          </label>
                          <div className="user-password-input">
                            <input
                              type={showPassword ? "text" : "password"}
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              required
                              className="user-form-input password-input"
                              placeholder="Contraseña"
                            />
                            <span className="user-password-icon" onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="user-form-actions">
                    {modalMode === "edit" && (
                      <p className="user-form-warning">
                        <AlertTriangle
                          size={16}
                          style={{
                            marginRight: "8px",
                            verticalAlign: "middle",
                          }}
                        />
                        Tenga cuidado con los cambios implementados.
                      </p>
                    )}
                    {modalMode === "create" && (
                      <p className="user-form-warning">
                        <AlertTriangle
                          size={16}
                          style={{
                            marginRight: "8px",
                            verticalAlign: "middle",
                          }}
                        />
                        Revise bien los datos antes de crear el usuario.
                      </p>
                    )}
                  </div>
                  <div className="container-botton">
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
                ¿Estás seguro de que deseas eliminar al usuario <strong>{`${userToDelete?.first_name}`}</strong>?
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
