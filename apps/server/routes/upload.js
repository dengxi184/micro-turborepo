const express = require('express');
const UploadController = require('../controllers/UploadController');

const router = express.Router();

router.post('/upload-file', UploadController.upload);
router.get('/merge', UploadController.merge);
router.get('/upload-list', UploadController.getFileList);
router.delete('/delete-file', UploadController.deleteFile);
router.get('/record', UploadController.getFileByHash);
router.post('/upload-img', UploadController.uploadImg);
router.delete('/delete-img', UploadController.deleteImg);
router.get('/get-img-list', UploadController.getImgList);

module.exports = router;
