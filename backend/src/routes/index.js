const express = require('express');
const router = express.Router();

const employeeRoutes = require('./employees');
const announcementRoutes = require('./announcements');
const documentRoutes = require('./documents');
const organizationRoutes = require('./organizations');

router.use('/employees', employeeRoutes);
router.use('/announcements', announcementRoutes);
router.use('/documents', documentRoutes);
router.use('/organizations', organizationRoutes);

router.get('/', (req, res) => {
  res.json({ message: 'Intranet API Routes' });
});

module.exports = router;