const FileStorageInterface = require('./fileStorageInterface');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3-transform');
const multer = require('multer');
const fs = require('fs');
const sharp = require('sharp')
module.exports = class AWSStorage extends FileStorageInterface {
  constructor(AWSConstants) {
    super();
    this.AWSConstants = AWSConstants;
    aws.config.update({
      accessKeyId: AWSConstants.accessKeyId,
      secretAccessKey: AWSConstants.secretAccessKey,
      region: AWSConstants.region,
    });
  }

  uploadFromFilePath(filePath, key) {
    return new Promise((resolve, reject) => {
      const AWSConstants = this.AWSConstants;
      fs.readFile(filePath, function(err, data) {
        if (err) {
          if (fs.existsSync(path)) {
            fs.unlinkSync(filePath);
          }
          return reject(err);
        }
        const s3 = new aws.S3();
        s3.upload(
          {
            Bucket: AWSConstants.bucket,
            Key: key,
            Body: data,
          },
          function(err, response) {
            if (fs.existsSync(path)) {
              fs.unlinkSync(filePath);
            }
            if (err) return reject(err);
            resolve(response);
          }
        );
      });
    });
  }

  upload(pathComponants, request, response) {
    const s3 = new aws.S3();
    const uploader = multer({
      storage: multerS3({
        s3: s3,
        bucket: this.AWSConstants.bucket,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function(req, file, cb) {
          if (pathComponants) {
            cb(null, `${pathComponants}/${file.originalname}`);
          } else {
            cb(null, file.originalname);
          }
        },
      }),
    }).any();

    return new Promise(resolve => {
      uploader(request, response, error => {
        if (error) return resolve(false);
        resolve(true);
      });
    });
  }

  delete(keys) {
    const command = { Objects: [], Quiet: true };
    for (const key of keys) {
      command.Objects.push({
        Key: key,
      });
    }

    const s3 = new aws.S3();
    const options = {
      Bucket: this.AWSConstants.bucket,
      Delete: command,
    };

    return new Promise(resolve => {
      s3.deleteObjects(options, (error, data) => {
        error ? resolve(false) : resolve(true);
      });
    });
  }
  
  download(key, response, bucketName) {
    const s3 = new aws.S3();
    const options = {
      Bucket: bucketName,
      Key: key,
    };
    s3.listObjects(
      {
        Bucket: bucketName,
        Prefix: key,
      },
      (error, data) => {
        if (error || data.Contents.length == 0 || data.Contents[0].Key != key) {
          response.status(404).send('Bundle not found');
        } else {
          const object = s3.getObject(options)
          const fileStream = object.createReadStream();
          fileStream.pipe(response)
        }
      }
    );
  }

  imageAsBase64(key, response, bucketName,id,userRepository,tenantId) {
    const s3 = new aws.S3();
    const options = {
      Bucket: bucketName,
      Key: key,
    };
    s3.listObjects(
      {
        Bucket: bucketName,
        Prefix: key,
      },
      async (error, data) => {
        if (error || data.Contents.length == 0 || data.Contents[0].Key != key) {
          response.status(404).end();
        } else {
          
          //base64 response
          await s3.getObject(options, async function(error, data) {
            let attachment, file;
            file = Buffer.from(data.Body, 'binary');
            attachment = file.toString('base64');
              let img = new Buffer.from(attachment, 'base64');
                sharp(img)
                .resize(64, 64)
                .toBuffer()
                .then(async resizedImageBuffer => {
                    let resizedImageData = resizedImageBuffer.toString('base64');
                    await userRepository.findOneAndUpdate({_id:id},{profilePic:resizedImageData},null,tenantId)
                    response.send({attachment:resizedImageData,message:'success'})
                })
                .catch(error => {
                    // error handeling
                    response.send(error)
                })            
          });
        }
      }
    );
  
}
  
};
