const express = require('express');
const router=express.Router();

const Notification=require('../models/notification');
const notifController=require('../controllers/notifications')

router.get('/notifications',notifController.indexNotifications);

router.get('/notifications/new',notifController.newNotifForm)

router.post('/notifications', notifController.newNotifLogic)

router.get('/notifications/:id/edit', notifController.editNotif)

router.patch('/notifications/:id',notifController.updateNotif)

router.delete('/notifications/:id', notifController.deleteNotif)

module.exports=router;