const Notification=require('../models/notification');

exports.indexNotifications=async (req,res)=>{

    try {
        const allNotifs= await Notification.find();
        res.render('notifications/index',{allNotifs});

    } catch (error) {
        res.send(error);
    }

};

exports.newNotifForm=(req,res)=>{
    res.render('notifications/new');
};

exports.newNotifLogic=async (req,res)=>{
    try {
     const newNotif=new Notification({
         title:req.body.title,
         body: req.body.body,
         author: req.body.author
 
     });
      await newNotif.save();
      res.redirect('/notifications')
    } catch (error) {
     res.send(error);
    }
 }

 exports.editNotif=async (req,res)=>{
    try {
        const foundNotif = await Notification.findById(req.params.id);
		res.render('notifications/edit', { foundNotif });
        
    } catch (error) {
        res.send(error);
    }
};

exports.updateNotif=async (req,res)=>{
    try {
        const notifData = {
			title: req.body.title,
			body: req.body.body,
			author: req.body.author
		};
        await Notification.findByIdAndUpdate(req.params.id,notifData);
        res.redirect('/notifications')
    } catch (error) {
        res.send(error);
    }
}

exports.deleteNotif=async (req,res)=>{
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.redirect('/notifications');
    } catch (error) {
        res.send(error);
    }
    }