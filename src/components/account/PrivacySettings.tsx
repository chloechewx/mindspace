import React, { useState } from 'react';
import { Shield, Lock, Eye, Download, Trash2, AlertTriangle } from 'lucide-react';

export const PrivacySettings: React.FC = () => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="soft-card p-6">
        <h2 className="text-3xl font-serif font-semibold text-gray-800 mb-2">
          Privacy & Security
        </h2>
        <p className="text-gray-600">
          Manage your data and security settings
        </p>
      </div>

      {/* Data Encryption */}
      <div className="soft-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-sage-400 to-sage-500 rounded-xl flex items-center justify-center">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-serif font-semibold text-gray-800">Data Encryption</h3>
        </div>
        
        <div className="bg-sage-50 rounded-2xl p-6 border-2 border-sage-100">
          <div className="flex items-start gap-3 mb-4">
            <Shield className="w-6 h-6 text-sage-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Your data is secure</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                All your journal entries, session notes, and personal information are encrypted using industry-standard AES-256 encryption. 
                Your data is encrypted both in transit and at rest, ensuring maximum security.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-sage-700">
            <div className="w-2 h-2 bg-sage-500 rounded-full animate-pulse"></div>
            <span>Encryption active</span>
          </div>
        </div>
      </div>

      {/* Data Visibility */}
      <div className="soft-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-lavender-400 to-lavender-500 rounded-xl flex items-center justify-center">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-serif font-semibold text-gray-800">Data Visibility</h3>
        </div>
        
        <div className="space-y-4">
          <div className="bg-lavender-50 rounded-2xl p-4 border-2 border-lavender-100">
            <h4 className="font-semibold text-gray-800 mb-2">Who can see your data:</h4>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-lavender-600 mt-1">•</span>
                <span><strong>You:</strong> Full access to all your data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lavender-600 mt-1">•</span>
                <span><strong>Your Therapist:</strong> Only if you enable "Share progress with therapist" in preferences</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lavender-600 mt-1">•</span>
                <span><strong>MindSpace:</strong> Anonymized analytics only (no personal content)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lavender-600 mt-1">•</span>
                <span><strong>Third Parties:</strong> Never shared without explicit consent</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Data Export */}
      <div className="soft-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blush-400 to-blush-500 rounded-xl flex items-center justify-center">
            <Download className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-serif font-semibold text-gray-800">Export Your Data</h3>
        </div>
        
        <p className="text-gray-600 mb-4">
          Download a complete copy of your MindSpace data including journal entries, session history, and preferences.
        </p>
        
        <button className="btn-warm flex items-center gap-2">
          <Download className="w-5 h-5" />
          Request Data Export
        </button>
        
        <p className="text-sm text-gray-500 mt-3">
          You'll receive an email with a secure download link within 24 hours.
        </p>
      </div>

      {/* Account Deletion */}
      <div className="soft-card p-6 border-2 border-blush-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blush-500 to-blush-600 rounded-xl flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-serif font-semibold text-gray-800">Delete Account</h3>
        </div>
        
        <div className="bg-blush-50 rounded-2xl p-4 border-2 border-blush-200 mb-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-blush-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-700">
              <p className="font-semibold mb-1">This action cannot be undone</p>
              <p>Deleting your account will permanently remove all your data, including journal entries, session history, and preferences.</p>
            </div>
          </div>
        </div>
        
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-6 py-3 rounded-full border-2 border-blush-400 text-blush-700 hover:bg-blush-50 transition-colors font-semibold"
          >
            Delete My Account
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-gray-700 font-semibold">Are you absolutely sure?</p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  alert('Account deletion initiated. You will receive a confirmation email.');
                  setShowDeleteConfirm(false);
                }}
                className="px-6 py-3 rounded-full bg-blush-600 text-white hover:bg-blush-700 transition-colors font-semibold"
              >
                Yes, Delete Forever
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-3 rounded-full border-2 border-sage-300 text-gray-700 hover:bg-sage-50 transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Privacy Policy */}
      <div className="soft-card p-6 bg-gradient-to-br from-sage-50 to-cream-50">
        <h3 className="text-xl font-serif font-semibold text-gray-800 mb-3">
          Privacy Resources
        </h3>
        <div className="space-y-2">
          <button className="text-sage-700 hover:text-sage-800 font-semibold transition-colors flex items-center gap-2">
            📄 Privacy Policy
          </button>
          <button className="text-sage-700 hover:text-sage-800 font-semibold transition-colors flex items-center gap-2">
            📋 Terms of Service
          </button>
          <button className="text-sage-700 hover:text-sage-800 font-semibold transition-colors flex items-center gap-2">
            🔒 Security Practices
          </button>
          <button className="text-sage-700 hover:text-sage-800 font-semibold transition-colors flex items-center gap-2">
            ⚖️ HIPAA Compliance
          </button>
        </div>
      </div>
    </div>
  );
};
