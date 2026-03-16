import { useEffect, useState } from 'react';
import settingsService from '../../services/settingsService';
import Toast from '../../components/common/Toast';
import './Settings.css';

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hotel');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Form states
  const [hotelInfo, setHotelInfo] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    description: ''
  });

  const [timeSettings, setTimeSettings] = useState({
    checkInTime: '14:00',
    checkOutTime: '11:00'
  });

  const [emailSettings, setEmailSettings] = useState({
    host: '',
    port: 587,
    secure: false,
    auth: {
      user: '',
      pass: ''
    }
  });

  const [paymentSettings, setPaymentSettings] = useState({
    currency: 'USD',
    taxRate: 0,
    acceptedMethods: []
  });

  const [policies, setPolicies] = useState({
    cancellationPolicy: '',
    termsAndConditions: ''
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    const result = await settingsService.getSettings();
    
    if (result.success && result.data) {
      setSettings(result.data);
      
      // Populate form states
      if (result.data.hotelInfo) {
        setHotelInfo(result.data.hotelInfo);
      }
      
      setTimeSettings({
        checkInTime: result.data.checkInTime || '14:00',
        checkOutTime: result.data.checkOutTime || '11:00'
      });
      
      if (result.data.emailSettings) {
        setEmailSettings(result.data.emailSettings);
      }
      
      if (result.data.paymentSettings) {
        setPaymentSettings(result.data.paymentSettings);
      }
      
      setPolicies({
        cancellationPolicy: result.data.cancellationPolicy || '',
        termsAndConditions: result.data.termsAndConditions || ''
      });
    } else {
      showToast(result.error || 'Failed to load settings', 'error');
    }
    
    setIsLoading(false);
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleHotelInfoChange = (e) => {
    const { name, value } = e.target;
    setHotelInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleTimeSettingsChange = (e) => {
    const { name, value } = e.target;
    setTimeSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleEmailSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('auth.')) {
      const authField = name.split('.')[1];
      setEmailSettings(prev => ({
        ...prev,
        auth: { ...prev.auth, [authField]: value }
      }));
    } else {
      setEmailSettings(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) : value)
      }));
    }
  };

  const handlePaymentSettingsChange = (e) => {
    const { name, value, type } = e.target;
    setPaymentSettings(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handlePaymentMethodToggle = (method) => {
    setPaymentSettings(prev => ({
      ...prev,
      acceptedMethods: prev.acceptedMethods.includes(method)
        ? prev.acceptedMethods.filter(m => m !== method)
        : [...prev.acceptedMethods, method]
    }));
  };

  const handlePoliciesChange = (e) => {
    const { name, value } = e.target;
    setPolicies(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveHotelInfo = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    const result = await settingsService.updateHotelInfo({
      ...hotelInfo,
      ...timeSettings
    });
    
    if (result.success) {
      showToast('Hotel information updated successfully', 'success');
      loadSettings();
    } else {
      showToast(result.error, 'error');
    }
    
    setIsSaving(false);
  };

  const handleSaveEmailSettings = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    const result = await settingsService.updateEmailSettings(emailSettings);
    
    if (result.success) {
      showToast('Email settings updated successfully', 'success');
      loadSettings();
    } else {
      showToast(result.error, 'error');
    }
    
    setIsSaving(false);
  };

  const handleSavePaymentSettings = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    const result = await settingsService.updatePaymentSettings(paymentSettings);
    
    if (result.success) {
      showToast('Payment settings updated successfully', 'success');
      loadSettings();
    } else {
      showToast(result.error, 'error');
    }
    
    setIsSaving(false);
  };

  const handleSavePolicies = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    const result = await settingsService.updatePolicies(policies);
    
    if (result.success) {
      showToast('Policies updated successfully', 'success');
      loadSettings();
    } else {
      showToast(result.error, 'error');
    }
    
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="settings-container">
        <div className="loading">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>System Settings</h1>
      </div>

      <div className="settings-tabs">
        <button
          className={`tab-button ${activeTab === 'hotel' ? 'active' : ''}`}
          onClick={() => setActiveTab('hotel')}
        >
          Hotel Information
        </button>
        <button
          className={`tab-button ${activeTab === 'email' ? 'active' : ''}`}
          onClick={() => setActiveTab('email')}
        >
          Email Settings
        </button>
        <button
          className={`tab-button ${activeTab === 'payment' ? 'active' : ''}`}
          onClick={() => setActiveTab('payment')}
        >
          Payment Settings
        </button>
        <button
          className={`tab-button ${activeTab === 'policies' ? 'active' : ''}`}
          onClick={() => setActiveTab('policies')}
        >
          Policies
        </button>
      </div>

      <div className="settings-content">
        {activeTab === 'hotel' && (
          <form onSubmit={handleSaveHotelInfo} className="settings-form">
            <h2>Hotel Information</h2>
            
            <div className="form-group">
              <label htmlFor="name">Hotel Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={hotelInfo.name}
                onChange={handleHotelInfoChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={hotelInfo.address}
                onChange={handleHotelInfoChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={hotelInfo.phone}
                  onChange={handleHotelInfoChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={hotelInfo.email}
                  onChange={handleHotelInfoChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={hotelInfo.description}
                onChange={handleHotelInfoChange}
                rows="4"
              />
            </div>

            <h3>Check-in/Check-out Times</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="checkInTime">Check-in Time</label>
                <input
                  type="time"
                  id="checkInTime"
                  name="checkInTime"
                  value={timeSettings.checkInTime}
                  onChange={handleTimeSettingsChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="checkOutTime">Check-out Time</label>
                <input
                  type="time"
                  id="checkOutTime"
                  name="checkOutTime"
                  value={timeSettings.checkOutTime}
                  onChange={handleTimeSettingsChange}
                />
              </div>
            </div>

            <button type="submit" className="save-button" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Hotel Information'}
            </button>
          </form>
        )}

        {activeTab === 'email' && (
          <form onSubmit={handleSaveEmailSettings} className="settings-form">
            <h2>Email Settings</h2>
            
            <div className="form-group">
              <label htmlFor="host">SMTP Host</label>
              <input
                type="text"
                id="host"
                name="host"
                value={emailSettings.host}
                onChange={handleEmailSettingsChange}
                placeholder="smtp.example.com"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="port">SMTP Port</label>
                <input
                  type="number"
                  id="port"
                  name="port"
                  value={emailSettings.port}
                  onChange={handleEmailSettingsChange}
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="secure"
                    checked={emailSettings.secure}
                    onChange={handleEmailSettingsChange}
                  />
                  Use SSL/TLS
                </label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="auth.user">Email Username</label>
              <input
                type="text"
                id="auth.user"
                name="auth.user"
                value={emailSettings.auth.user}
                onChange={handleEmailSettingsChange}
                placeholder="user@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="auth.pass">Email Password</label>
              <input
                type="password"
                id="auth.pass"
                name="auth.pass"
                value={emailSettings.auth.pass}
                onChange={handleEmailSettingsChange}
                placeholder="Enter password"
              />
            </div>

            <button type="submit" className="save-button" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Email Settings'}
            </button>
          </form>
        )}

        {activeTab === 'payment' && (
          <form onSubmit={handleSavePaymentSettings} className="settings-form">
            <h2>Payment Settings</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="currency">Currency</label>
                <select
                  id="currency"
                  name="currency"
                  value={paymentSettings.currency}
                  onChange={handlePaymentSettingsChange}
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                  <option value="NGN">NGN - Nigerian Naira</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="taxRate">Tax Rate (%)</label>
                <input
                  type="number"
                  id="taxRate"
                  name="taxRate"
                  value={paymentSettings.taxRate}
                  onChange={handlePaymentSettingsChange}
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Accepted Payment Methods</label>
              <div className="payment-methods">
                {[
                  { label: 'Credit Card', value: 'credit_card' },
                  { label: 'Debit Card', value: 'debit_card' },
                  { label: 'PayPal', value: 'paypal' },
                  { label: 'Bank Transfer', value: 'bank_transfer' },
                  { label: 'Cash', value: 'cash' }
                ].map(method => (
                  <label key={method.value} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={paymentSettings.acceptedMethods.includes(method.value)}
                      onChange={() => handlePaymentMethodToggle(method.value)}
                    />
                    {method.label}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="save-button" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Payment Settings'}
            </button>
          </form>
        )}

        {activeTab === 'policies' && (
          <form onSubmit={handleSavePolicies} className="settings-form">
            <h2>Policies</h2>
            
            <div className="form-group">
              <label htmlFor="cancellationPolicy">Cancellation Policy</label>
              <textarea
                id="cancellationPolicy"
                name="cancellationPolicy"
                value={policies.cancellationPolicy}
                onChange={handlePoliciesChange}
                rows="6"
                placeholder="Enter your cancellation policy..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="termsAndConditions">Terms and Conditions</label>
              <textarea
                id="termsAndConditions"
                name="termsAndConditions"
                value={policies.termsAndConditions}
                onChange={handlePoliciesChange}
                rows="8"
                placeholder="Enter your terms and conditions..."
              />
            </div>

            <button type="submit" className="save-button" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Policies'}
            </button>
          </form>
        )}
      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: '' })}
        />
      )}
    </div>
  );
};

export default Settings;
