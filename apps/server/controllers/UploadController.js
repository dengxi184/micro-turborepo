const multiparty = require('multiparty');
const fs = require('fs');
const { Buffer } = require('buffer');
const rimraf = require('rimraf');
const sizeOf = require('image-size');

const multer = require('../utils/multer');
const baseURL = require('../utils/getBaseURL');

const File = require('../models/fileModel');
const Img = require('../models/imgModel');

exports.getImgList = [
  async (req, res) => {
    try {
      const { keyword, curPage, pageSize } = req.query;
      const str = '^.*' + keyword + '.*$';
      const reg = new RegExp(str);
      const skipCount = (+curPage - 1) * +pageSize;
      const list = await Img.find({ imgName: { $regex: reg, $options: 'i' } })
        .sort({ creatAt: -1 }) // 按创建时降序
        .skip(skipCount) // 跳过的条数
        .limit(+pageSize); //查询几条
      const total = await Img.find({
        imgName: { $regex: reg, $options: 'i' },
      }).count();
      res.send({
        list,
        total,
      });
    } catch (err) {
      console.log(err);
    }
  },
];

exports.deleteImg = [
  async (req, res) => {
    const { fileName, creatAt } = req.query;
    const file = await Img.findOne({ creatAt });
    if (file) {
      await Img.deleteOne({ creatAt });
      await rimraf(`static/images/${fileName}`);
      res.send({ msg: '删除成功！' });
    } else {
      res.send({ msg: '服务器上不存在该文件！' });
    }
  },
];

exports.uploadImg = [
  async (req, res) => {
    multer.single('file')(req, res, async (err) => {
      if (err) {
        res.send({
          msg: err,
          filePath: '/',
        });
      } else {
        const { fileRename, imgName, createAt } = req;
        const url = `${baseURL}/static/images/${fileRename}`;
        const file = await fs.promises.stat(`static/images/${fileRename}`);
        const size = `${(file.size / 1024 / 1024).toFixed(3)}M`;
        sizeOf(`static/images/${fileRename}`, async (err, dimensions) => {
          if (!err) {
            const scale = +dimensions.width / +dimensions.height;
            await Img.create({
              fileName: fileRename,
              createAt,
              imgName,
              size,
              url,
              scale,
            });
            res.send({
              msg: '上传成功',
              filePath: url,
              createAt,
              fileName: imgName,
            });
          }
        });
      }
    });
  },
];

exports.getFileByHash = [
  async (req, res) => {
    const { fileHash, fileName } = req.query;
    const file = await File.findOne({ fileHash });
    const dir = `static/temporary/${fileName}`;
    if (!file && !fs.existsSync(dir)) {
      res.send({ msg: '该文件服务器没有上传记录', status: 1, sliceIndex: [] });
    } else if (file) {
      res.send({ msg: '服务器已存在该文件', status: 3, sliceIndex: [] });
    } else {
      const hashList = fs.readdirSync(dir);
      res.send({
        msg: '部分分片上传的文件，是否要覆盖上传',
        status: 1,
        sliceIndex: hashList,
      });
    }
  },
];

exports.getFileList = [
  async (_, res) => {
    const uploadedFileList = await File.find();
    res.send(uploadedFileList);
  },
];

exports.deleteFile = [
  async (req, res) => {
    const { fileHash } = req.query;
    const file = await File.findOne({ fileHash });
    if (file) {
      await File.deleteOne({ fileHash });
      await rimraf(`static/files/${file.fileName}`);
      res.send({ msg: '删除成功！' });
    } else {
      res.send({ msg: '服务器上不存在该文件！' });
    }
  },
];

// 上传切片
exports.upload = [
  async (req, res) => {
    const form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
      if (err) return;
      const fileName = fields.fileName[0];
      const hash = fields.hash[0];
      const chunk = files.chunk[0];
      const dir = `static/temporary/${fileName}`;
      try {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        const buffer = fs.readFileSync(chunk.path);
        const ws = fs.createWriteStream(`${dir}/${hash}`);
        ws.write(buffer);
        ws.close();
        res.send(`${fileName}-${hash} 切片上传成功`);
      } catch (error) {
        res.status(500).send(`${fileName}-${hash} 切片上传失败`);
      }
    });
  },
];

// 切片合并
exports.merge = [
  async (req, res) => {
    const { fileName, fileHash } = req.query;
    try {
      let len = 0;
      const bufferList = fs
        .readdirSync(`static/temporary/${fileName}`)
        .map((hash, index) => {
          const buffer = fs.readFileSync(
            `static/temporary/${fileName}/${index}`,
          );
          len += buffer.length;
          return buffer;
        });
      //合并文件
      const buffer = Buffer.concat(bufferList, len);
      const ws = fs.createWriteStream(`static/files/${fileName}`);
      ws.write(buffer, async (err) => {
        if (err) return res.send('文件合并失败');
        const file = await fs.promises.stat(`static/files/${fileName}`);
        const size = `${(file.size / 1024 / 1024).toFixed(1)}M`;
        const prefix =
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000/static/files'
            : `${baseURL}/static/files`;
        await File.create({
          fileName,
          fileHash,
          status: 3,
          key: Date.now(),
          size,
        });
        res.send({
          prefix,
          suffix: `/${fileName}`,
          fileName: `${fileName}`,
          size,
          status: 2,
        });
      });
      ws.close();
    } catch (error) {
      console.error(error, 62);
    } finally {
      await rimraf(`static/temporary/${fileName}`);
    }
  },
];
// 文件流压缩
// const { pipeline } = require('stream');
// const zlib = require('zlib');
// pipeline(
//   fs.createReadStream(`static/files/${fileName}`),
//   zlib.createGzip(),
//   fs.createWriteStream(`static/files/${fileName}.gz`),
//   (err) => {
//     if (err) {
//       console.error('Pipeline failed', err);
//     } else {
//       console.log('Pipeline succeeded');
//     }
//   }
// );
