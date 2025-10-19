import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Apply protect middleware to all routes
router.use(protect);

// GET /api/settings/user - Fetch user data including settings
router.get('/user', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('firstName lastName email settings profilePicture');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      name: `${user.firstName} ${user.lastName}`,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePicture: user.profilePicture,
      settings: {
        appearance: user.settings?.appearance || { theme: 'system', darkMode: false },
        notifications: user.settings?.notifications || {
          skillAlerts: true,
          projectUpdates: true,
          weeklyReports: false,
          recommendations: true,
        },
        privacy: user.settings?.privacy || {
          profileVisible: true,
          skillsVisible: true,
          projectsVisible: true,
        },
      },
    });
  } catch (error) {
    console.error('GET /user error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// PUT /api/settings/user - Update email, password, and/or settings
router.put('/user', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { email, currentPassword, newPassword, settings } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate password changes and email updates
    if ((email || newPassword) && !currentPassword) {
      return res.status(400).json({ error: 'Current password is required to make changes' });
    }

    if ((email || newPassword) && currentPassword) {
      const isPasswordValid = await user.matchPassword(currentPassword);
      
      // Debug logging
      console.log('Current password input:', currentPassword);
      console.log('Stored password hash:', user.password);
      console.log('Password match result:', isPasswordValid);
      
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Incorrect current password' });
      }
    }

    // Update email
    if (email && email !== user.email) {
      // Validate university email format - must contain @ and a domain
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Please use a valid email address (e.g., alex.rivera@university.edu)' });
      }
      
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
      user.email = email.toLowerCase();
    }

    // Update password
    if (newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // Update settings
    if (settings) {
      if (settings.appearance) {
        user.settings.appearance = {
          ...user.settings.appearance,
          ...settings.appearance,
        };
      }
      if (settings.notifications) {
        user.settings.notifications = {
          ...user.settings.notifications,
          ...settings.notifications,
        };
      }
      if (settings.privacy) {
        user.settings.privacy = {
          ...user.settings.privacy,
          ...settings.privacy,
        };
      }
    }

    await user.save();

    res.json({
      message: 'Settings updated successfully',
      name: `${user.firstName} ${user.lastName}`,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePicture: user.profilePicture,
      settings: user.settings,
    });
  } catch (error) {
    console.error('PUT /user error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// GET /api/settings/appearance - Get appearance settings only
router.get('/appearance', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('settings.appearance');
    
    res.json({
      appearance: user.settings?.appearance || { theme: 'system', darkMode: false },
    });
  } catch (error) {
    console.error('GET /appearance error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// PUT /api/settings/appearance - Update appearance settings only
router.put('/appearance', async (req, res) => {
  try {
    const { theme, darkMode } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (theme) user.settings.appearance.theme = theme;
    if (darkMode !== undefined) user.settings.appearance.darkMode = darkMode;

    await user.save();

    res.json({
      message: 'Appearance settings updated',
      appearance: user.settings.appearance,
    });
  } catch (error) {
    console.error('PUT /appearance error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// PUT /api/settings/notifications - Update notification settings
router.put('/notifications', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.settings.notifications = {
      ...user.settings.notifications,
      ...req.body,
    };

    await user.save();

    res.json({
      message: 'Notification settings updated',
      notifications: user.settings.notifications,
    });
  } catch (error) {
    console.error('PUT /notifications error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// PUT /api/settings/privacy - Update privacy settings
router.put('/privacy', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.settings.privacy = {
      ...user.settings.privacy,
      ...req.body,
    };

    await user.save();

    res.json({
      message: 'Privacy settings updated',
      privacy: user.settings.privacy,
    });
  } catch (error) {
    console.error('PUT /privacy error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

export default router;