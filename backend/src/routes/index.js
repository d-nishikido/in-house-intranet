const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const employeeRoutes = require('./employees');
const announcementRoutes = require('./announcements');
const documentRoutes = require('./documents');
const organizationRoutes = require('./organizations');
const externalLinksRoutes = require('./external-links');
const attendanceRoutes = require('./attendance');

router.use('/auth', authRoutes);
router.use('/employees', employeeRoutes);
router.use('/announcements', announcementRoutes);
router.use('/documents', documentRoutes);
router.use('/organizations', organizationRoutes);
router.use('/external-links', externalLinksRoutes);
router.use('/attendance', attendanceRoutes);

router.get('/', (req, res) => {
  res.json({ message: 'Intranet API Routes' });
});

module.exports = router;