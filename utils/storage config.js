const multer = require('multer');
//image file storage 
exports.image_storage = multer.diskStorage({
    destination: (req, file, callback) => {
        if (file.fieldname == 'salon_photo') {
            callback(null, 'public/images/salon/interior');
        }
        else if (file.fieldname == 'work_samples') {

            callback(null, 'public/images/salon/work samples');
        }
    },
    filename: (req, file, callback) => {
        callback(null, new Date().getTime() + '.jpg');
    }
});

exports.imageFileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {

        callback(null, true);
    }
    else {
        callback(null, false);
    }
}

