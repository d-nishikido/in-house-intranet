const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const employeeRoutes = require('./employees');
const announcementRoutes = require('./announcements');
const documentRoutes = require('./documents');
const documentTemplateRoutes = require('./document-templates');
const organizationRoutes = require('./organizations');
const externalLinksRoutes = require('./external-links');
const attendanceRoutes = require('./attendance');
const menuRoutes = require('./menu');

router.use('/auth', authRoutes);
router.use('/employees', employeeRoutes);
router.use('/announcements', announcementRoutes);
router.use('/documents', documentRoutes);
router.use('/document-templates', documentTemplateRoutes);
router.use('/organizations', organizationRoutes);
router.use('/external-links', externalLinksRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/menu', menuRoutes);

router.get('/', (req, res) => {
  res.json({ message: 'Intranet API Routes' });
});

module.exports = router;