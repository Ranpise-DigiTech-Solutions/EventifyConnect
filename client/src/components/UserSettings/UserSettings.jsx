import React, { useState } from 'react';
import './UserSettings.scss';

const SettingsComponent = () => {
  const [theme, setTheme] = useState('light');
  const [emailNotifications, setEmailNotifications] = useState('enabled');
  const [defaultLocation, setDefaultLocation] = useState('defaultLocation');
  const [currentSection, setCurrentSection] = useState('additionalSettings');

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  const renderAdditionalSettings = () => {
    return (
      <div className="settings__section">
     
        <div className="settings__option">
          <label htmlFor="emailNotifications">Push Notifications:</label>
          <select
            id="emailNotifications"
            value={emailNotifications}
            onChange={(e) => setEmailNotifications(e.target.value)}
          >
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>
        <div className="settings__option">
          <label htmlFor="defaultLocation">Default Location:</label>
          <select
            id="defaultLocation"
            value={defaultLocation}
            onChange={(e) => setDefaultLocation(e.target.value)}
          >
            <option value="defaultLocation">Default Location</option>
            <option value="location1">Location 1</option>
            {/* Add more locations as needed */}
          </select>
        </div>
        {/* Add more additional settings here */}
      </div>
    );
  };

  return (
    <div className="settings">
      <div className="settings__menu">
        <button onClick={() => setCurrentSection('theme')}>Theme</button>
        <button onClick={() => setCurrentSection('additionalSettings')}>Additional Settings</button>
      </div>
      <div className="settings__content">
        <div className="settings__section">
          {currentSection === 'theme' ? (
            <div className="settings__option">
              <label htmlFor="theme">Theme:</label>
              <select
                id="theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          ) : (
            renderAdditionalSettings()
          )}
        </div>
      </div>
      <div className="settings__actions">
        <button onClick={handleSave}>Save Changes</button>
      </div>
    </div>
  );
};

export default SettingsComponent;
