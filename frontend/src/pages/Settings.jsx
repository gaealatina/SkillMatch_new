import DashboardNav from '../components/dashboardNAv';
import { useState } from 'react';
import { Eye, EyeOff, Trash2 } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('account');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav userName="Alex Rivera" isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

       

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Settings Card */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your account preferences and application settings</p>
          </div>
          {/* Settings Tabs */}
          <div className="px-4 sm:px-6 pt-4 sm:pt-6">
            <div className="inline-flex bg-gray-100 rounded-full justify-start gap-1 sm:gap-4 p-1 w-full sm:w-auto overflow-x-auto">
              <SettingsTab active={activeTab === 'account'} onClick={() => setActiveTab('account')}>
                Account
              </SettingsTab>
              <SettingsTab active={activeTab === 'appearance'} onClick={() => setActiveTab('appearance')}>
                Appearance
              </SettingsTab>
              <SettingsTab active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')}>
                Notifications
              </SettingsTab>
              <SettingsTab active={activeTab === 'privacy'} onClick={() => setActiveTab('privacy')}>
                Privacy
              </SettingsTab>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            {activeTab === 'account' && <AccountSettings showPasswords={showPasswords} togglePasswordVisibility={togglePasswordVisibility} />}
            {activeTab === 'appearance' && <AppearanceSettings />}
            {activeTab === 'notifications' && <NotificationSettings />}
            {activeTab === 'privacy' && <PrivacySettings />}
          </div>
        </section>
      </main>
    </div>
  );
}

function SettingsTab({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`transition flex items-center justify-center text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-full whitespace-nowrap ${
        active 
          ? 'bg-white text-gray-900 shadow-sm' 
          : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      {children}
    </button>
  );
}

function AccountSettings({ showPasswords, togglePasswordVisibility }) {
  return (
    <div className="space-y-6 sm:space-y-8 w-full">
      {/* Account Information */}
      <div className="w-full">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Information</h3>
        <p className="text-sm text-gray-600 mb-6">Update your email address and password</p>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Email</label>
            <input
              type="email"
              value="alex.rivera@university.edu"
              readOnly
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Email</label>
            <input
              type="email"
              defaultValue="newemail@university.edu"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                defaultValue="********"
                className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                defaultValue="********"
                className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                defaultValue="********"
                className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          
          <button className="bg-blue-600 text-white py-2.5 px-6 rounded-lg hover:bg-blue-700 transition text-sm font-medium">
            Save Changes
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="border border-red-200 rounded-lg p-4 sm:p-5 bg-red-50 w-full">
        <h3 className="text-lg font-semibold text-red-900 mb-2">Danger Zone</h3>
        <p className="text-sm text-red-700 mb-4">Irreversible account actions</p>
        <button className="flex items-center gap-2 bg-red-600 text-white py-2.5 px-4 rounded-lg hover:bg-red-700 transition text-sm font-medium">
          <Trash2 size={16} />
          Delete Account
        </button>
      </div>
    </div>
  );
}

function AppearanceSettings() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Appearance Settings</h3>
      <div className="text-center py-8">
        <div className="text-gray-500 text-sm">Appearance settings coming soon...</div>
      </div>
    </div>
  );
}

function NotificationSettings() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
      <div className="text-center py-8">
        <div className="text-gray-500 text-sm">Notification settings coming soon...</div>
      </div>
    </div>
  );
}

function PrivacySettings() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Privacy Settings</h3>
      <div className="text-center py-8">
        <div className="text-gray-500 text-sm">Privacy settings coming soon...</div>
      </div>
    </div>
  );
}
