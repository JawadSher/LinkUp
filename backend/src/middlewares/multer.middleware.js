import multer from "multer";
import {v4 as uuidv4} from "uuid";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, "./public/temp")
    },

    filename: function (req, file, cb){
        cb(null, file.fieldname + "-" + uuidv4() + path.extname(file.originalname));
    }
})

export const upload = multer({
    storage
})