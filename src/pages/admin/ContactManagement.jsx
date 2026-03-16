import { useState, useEffect } from 'react'
import contactService from '../../services/contactService'
import { DataTable, StatusBadge, Modal, Button, Alert } from '../../components/common'
import { formatDate } from '../../utils/formatters'
import './ContactManagement.css'

const ContactManagement = () => {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedContact, setSelectedContact] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    page: 1,
    limit: 20
  })
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1
  })
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchContacts()
    fetchStats()
  }, [filters])

  const fetchContacts = async () => {
    setLoading(true)
    const result = await contactService.getAllContacts(filters)
    
    if (result.success) {
      setContacts(result.data.data)
      setPagination({
        total: result.data.total,
        totalPages: result.data.totalPages,
        currentPage: result.data.currentPage
      })
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  const fetchStats = async () => {
    const result = await contactService.getContactStats()
    if (result.success) {
      setStats(result.data)
    }
  }

  const handleViewContact = async (contact) => {
    const result = await contactService.getContactById(contact._id)
    if (result.success) {
      setSelectedContact(result.data)
      setShowModal(true)
    }
  }

  const handleStatusChange = async (contactId, newStatus) => {
    const result = await contactService.updateContactStatus(contactId, newStatus)
    
    if (result.success) {
      fetchContacts()
      fetchStats()
      if (selectedContact && selectedContact._id === contactId) {
        setSelectedContact(result.data)
      }
    } else {
      setError(result.error)
    }
  }

  const handleDelete = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return
    }

    const result = await contactService.deleteContact(contactId)
    
    if (result.success) {
      fetchContacts()
      fetchStats()
      setShowModal(false)
    } else {
      setError(result.error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'info'
      case 'in-progress':
        return 'warning'
      case 'resolved':
        return 'success'
      case 'closed':
        return 'default'
      default:
        return 'default'
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (contact) => contact.name
    },
    {
      key: 'email',
      label: 'Email',
      render: (contact) => contact.email
    },
    {
      key: 'subject',
      label: 'Subject',
      render: (contact) => contact.subject
    },
    {
      key: 'status',
      label: 'Status',
      render: (contact) => (
        <StatusBadge status={contact.status} variant={getStatusColor(contact.status)} />
      )
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (contact) => formatDate(contact.createdAt)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (contact) => (
        <Button
          variant="primary"
          size="small"
          onClick={() => handleViewContact(contact)}
        >
          View
        </Button>
      )
    }
  ]

  return (
    <div className="contact-management">
      <div className="page-header">
        <h1>Contact Management</h1>
        <p>Manage customer inquiries and messages</p>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Contacts</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.todayCount}</div>
            <div className="stat-label">Today</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.byStatus.new}</div>
            <div className="stat-label">New</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.byStatus['in-progress']}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.byStatus.resolved}</div>
            <div className="stat-label">Resolved</div>
          </div>
        </div>
      )}

      <div className="filters">
        <div className="filter-group">
          <label>Status:</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
          >
            <option value="">All</option>
            <option value="new">New</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Search:</label>
          <input
            type="text"
            placeholder="Search by name, email, or subject..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={contacts}
        loading={loading}
        emptyMessage="No contacts found"
      />

      {pagination.totalPages > 1 && (
        <div className="pagination">
          <Button
            variant="outline"
            disabled={filters.page === 1}
            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
          >
            Previous
          </Button>
          <span>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={filters.page === pagination.totalPages}
            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
          >
            Next
          </Button>
        </div>
      )}

      {showModal && selectedContact && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Contact Details"
        >
          <div className="contact-details">
            <div className="detail-section">
              <h3>Contact Information</h3>
              <div className="detail-row">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{selectedContact.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{selectedContact.email}</span>
              </div>
              {selectedContact.phone && (
                <div className="detail-row">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{selectedContact.phone}</span>
                </div>
              )}
              <div className="detail-row">
                <span className="detail-label">Date:</span>
                <span className="detail-value">{formatDate(selectedContact.createdAt)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <StatusBadge 
                  status={selectedContact.status} 
                  variant={getStatusColor(selectedContact.status)} 
                />
              </div>
            </div>

            <div className="detail-section">
              <h3>Subject</h3>
              <p>{selectedContact.subject}</p>
            </div>

            <div className="detail-section">
              <h3>Message</h3>
              <p className="message-content">{selectedContact.message}</p>
            </div>

            {selectedContact.adminNotes && (
              <div className="detail-section">
                <h3>Admin Notes</h3>
                <p>{selectedContact.adminNotes}</p>
              </div>
            )}

            {selectedContact.resolvedBy && (
              <div className="detail-section">
                <h3>Resolution Info</h3>
                <div className="detail-row">
                  <span className="detail-label">Resolved By:</span>
                  <span className="detail-value">{selectedContact.resolvedBy.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Resolved At:</span>
                  <span className="detail-value">{formatDate(selectedContact.resolvedAt)}</span>
                </div>
              </div>
            )}

            <div className="modal-actions">
              <div className="status-actions">
                <label>Update Status:</label>
                <select
                  value={selectedContact.status}
                  onChange={(e) => handleStatusChange(selectedContact._id, e.target.value)}
                >
                  <option value="new">New</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <Button
                variant="danger"
                onClick={() => handleDelete(selectedContact._id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default ContactManagement
