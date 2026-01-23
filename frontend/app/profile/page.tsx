'use client';

import React from 'react';
import { Card, Badge, Button, Input, Alert } from '@/components/ui';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: typeof window !== 'undefined' ? localStorage.getItem('userName') || '' : '',
    phone: typeof window !== 'undefined' ? localStorage.getItem('userPhone') || '' : '',
    email: '',
    region: typeof window !== 'undefined' ? localStorage.getItem('userRegion') || '' : '',
    role: typeof window !== 'undefined' ? localStorage.getItem('userRole') || '' : '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('userName', formData.name);
    localStorage.setItem('userPhone', formData.phone);
    localStorage.setItem('userRegion', formData.region);
    setIsEditing(false);
  };

  const roleEmoji = {
    farmer: '🚜',
    distributor: '🚚',
    buyer: '🛒',
  };

  const emoji = roleEmoji[formData.role as keyof typeof roleEmoji] || '👤';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Profile</h1>
        <p className="text-slate-400 mt-1">Manage your account information</p>
      </div>

      {/* Profile Header */}
      <Card>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="text-6xl">{emoji}</div>
            <div>
              <h2 className="text-2xl font-bold text-slate-100">{formData.name || 'User'}</h2>
              <Badge variant="default">{formData.role || 'Role not set'}</Badge>
            </div>
          </div>
          {!isEditing && (
            <Button variant="secondary" size="md" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>
      </Card>

      {/* Profile Information */}
      {isEditing ? (
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-100">Edit Profile</h3>

            <Input
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />

            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />

            <Input
              label="Email (Optional)"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />

            <Input
              label="Region"
              type="text"
              name="region"
              value={formData.region}
              onChange={handleChange}
              placeholder="e.g., Manila, Batangas"
            />

            <div className="flex gap-3 pt-4 border-t border-slate-700">
              <Button variant="primary" size="md" onClick={handleSave}>
                Save Changes
              </Button>
              <Button variant="ghost" size="md" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <p className="text-slate-400 text-sm mb-1">Full Name</p>
            <p className="text-xl font-semibold text-slate-100">{formData.name}</p>
          </Card>
          <Card>
            <p className="text-slate-400 text-sm mb-1">Phone Number</p>
            <p className="text-xl font-semibold text-slate-100">{formData.phone}</p>
          </Card>
          <Card>
            <p className="text-slate-400 text-sm mb-1">Region</p>
            <p className="text-xl font-semibold text-slate-100">{formData.region || 'Not set'}</p>
          </Card>
          <Card>
            <p className="text-slate-400 text-sm mb-1">Account Type</p>
            <p className="text-xl font-semibold text-slate-100 capitalize">{formData.role}</p>
          </Card>
        </div>
      )}

      {/* Account Stats */}
      <div>
        <h3 className="text-xl font-bold text-slate-100 mb-4">Account Statistics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <p className="text-slate-400 text-sm mb-2">Member Since</p>
            <p className="text-2xl font-bold text-slate-100">6 months</p>
            <p className="text-xs text-slate-400 mt-1">Joined June 2025</p>
          </Card>
          <Card>
            <p className="text-slate-400 text-sm mb-2">Account Status</p>
            <Badge variant="success">Active</Badge>
          </Card>
          <Card>
            <p className="text-slate-400 text-sm mb-2">Verification</p>
            <Badge variant="success">Verified</Badge>
          </Card>
        </div>
      </div>

      {/* Security Settings */}
      <Card>
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-100">Security & Settings</h3>

          <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
            <div>
              <p className="font-semibold text-slate-100">Two-Factor Authentication</p>
              <p className="text-xs text-slate-400">Add an extra layer of security</p>
            </div>
            <Button variant="outline" size="sm">
              Enable
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
            <div>
              <p className="font-semibold text-slate-100">Change Password</p>
              <p className="text-xs text-slate-400">Update your account password</p>
            </div>
            <Button variant="outline" size="sm">
              Change
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
            <div>
              <p className="font-semibold text-slate-100">Privacy Settings</p>
              <p className="text-xs text-slate-400">Control data sharing preferences</p>
            </div>
            <Button variant="outline" size="sm">
              Manage
            </Button>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-900/50">
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-red-400">Danger Zone</h3>
          <p className="text-sm text-slate-400">
            These actions cannot be undone. Please proceed with caution.
          </p>
          <Button variant="outline" size="md" className="w-full text-red-400 border-red-600 hover:bg-red-900/10">
            Delete Account
          </Button>
        </div>
      </Card>

      {/* Help & Support */}
      <Alert variant="info">
        <p className="font-semibold text-blue-200 mb-1">📞 Need Help?</p>
        <p className="text-sm text-blue-100">Contact our support team at support@ethani.ph or call +63-2-8123-4567</p>
      </Alert>
    </div>
  );
}
