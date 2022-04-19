// import multer from 'multer';
const multer = require("multer")
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"../images")
    },
    filename:(req,file,cb)=>{
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null,file.fieldname + '-' + uniqueSuffix)
    }
})

const checkFile = (file,cb)=>{
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if(extname && mimetype){
        return cb(null,true)
    }else{
        return cb("Error: Only images are allowed",false)
    }

}

const upload = multer({
    storage:storage,
    fileSize:2e+6,
    fileFilter:function(req,file,cb){
        checkFile(file,cb)
    }
});

const deleteFile = (filePath)=>{
    fs.unlink(filePath,(err)=>{
        if(err){
            throw err;
        }
    })
}



module.exports = {upload,deleteFile};
