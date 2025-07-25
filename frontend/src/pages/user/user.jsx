"use client"

import { useState, useEffect } from "react"
import "./User.css"
import { personsImgs } from "../../utils/images"
import { AtSign, BadgeDollarSign, Calendar, Crown, Edit, Edit3, Eye, EyeOff, Filter, Hash, Save, Search, Shield, Trash2, UserIcon, UserPlus, Users, Warehouse, X } from "lucide-react";

const roles = [
  { value: "administrador", label: "Administrador", color: "#f59e0b" },
  { value: "bodega", label: "Bodega", color: "#3b82f6" },
  { value: "ventas", label: "Ventas", color: "#ef4444" },
]

import { getUsers, createUser, updateUser, deleteUser } from "../../services/api"

function User() {
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
      const matchesSearch =
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) || user.id.toString().includes(searchTerm)

      const matchesRole = filterRole === "todos" || user.role === filterRole

      return matchesSearch && matchesRole
    })

    setFilteredUsers(filtered)
  }, [users, searchTerm, filterRole])

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;

    if (name === "first_name") {
      formattedValue = value.toUpperCase();
    } else if (name === "username") {
      formattedValue = value.toLowerCase();
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
};

  const handleImageChange = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setSelectedImage(e.target.result)
          setFormData((prev) => ({ ...prev, image: e.target.result }))
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
        role: user.role,
        image: user.image || null,
      })
      setSelectedImage(user.image || null)
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

    try {
      if (modalMode === "create") {
        const newUser = await createUser(formData)
        setUsers((prev) => [...prev, newUser])
        window.location.reload()
      } else if (modalMode === "edit") {
        const updatedUser = await updateUser(selectedUser.id, formData)
        setUsers((prev) => prev.map((user) => (user.id === selectedUser.id ? updatedUser : user)))
        window.location.reload()
      }
    } catch (error) {
      console.error("Error submitting form:", error)
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
            placeholder="Buscar por nombre o ID..."
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
                  <div className="user-avatar">
                  </div>
                  <div className="user-basic-info">
                    <h4 className="user-name">{`${user.first_name}`}</h4>
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

                <div className="user-card-footer">
                  <div
                    className="user-role-badge"
                    style={{ backgroundColor: `${getRoleColor(user.role)}15`, color: getRoleColor(user.role) }}
                  >
                    <Shield size={12} />
                    {getRoleLabel(user.role)}
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
                        <span className="user-detail-value">{`${selectedUser.first_name}`}</span>
                      </div>
                      <div className="user-detail-item">
                        <UserIcon size={16} />
                        <span className="user-detail-label">ID:</span>
                        <span className="user-detail-value">{selectedUser.id}</span>
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
                      src={selectedImage || personsImgs.ISOTIPO || "/placeholder.svg?height=70&width=70"}
                      alt="Usuario"
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

                      {modalMode === "create" && (
                      <div className="user-form-group">
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
                            className="user-form-input password-input"
                            placeholder="Contraseña temporal"
                          />
                          <span
                            className="user-password-icon"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </span>
                        </div>
                      </div>

                      )}
                    </div>
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