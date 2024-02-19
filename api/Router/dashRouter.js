import express from "express";
import multer from "multer";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import crypto from "crypto";
import {
  deleteJobs,
  findCancle,
  getDrivers,
  getInvoice,
  getJobs,
  getvechileImage,
  jobsFindandUpdate,
  postDriver,
  postInvoice,
  postJobs,
  postVehicles,
} from "../moodle/moodle.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { InvoiceEmail } from "../verification/verification.js";
dotenv.config();

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const ascessKey = process.env.ASCESS_KEY;
const secretKey = process.env.SECRET_KEY;

const randomImageName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");
const imageName = randomImageName();
const s3 = new S3Client({
  credentials: {
    accessKeyId: ascessKey,
    secretAccessKey: secretKey,
  },
  region: bucketRegion,
});
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const dashRouter = express.Router();

dashRouter.get("/", async (req, res, next) => {
  try {
    const userId = req.headers.authorization;
    const data = await getJobs(userId);

    if (data) {
      res.json({
        status: "success",
        message: "Fatch Success!!",
        data,
      });
      return;
    }
    res.json({
      status: "error",
      message: "Something went wrong, Please try again!!",
    });
  } catch (error) {
    next(error);
  }
});
dashRouter.get("/vechileImage", async (req, res, next) => {
  try {
    const userId = req.headers.authorization;

    const data = await getvechileImage(userId);

    for (const datas of data) {
      const getObjectParams = {
        Bucket: bucketName,
        Key: datas.imageName,
      };
      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
      datas.imageName = url;
    }

    if (data) {
      res.json({
        status: "success",
        message: "Fatch Success vehicles!!",
        data,
      });
      return;
    }
    res.json({
      status: "error",
      message: "Something went wrong, Please try again!!",
    });
  } catch (error) {
    next(error);
  }
});
dashRouter.get("/allDriver", async (req, res, next) => {
  try {
    const userId = req.headers.authorization;

    const data = await getDrivers(userId);

    for (const datas of data) {
      const getObjectParams = {
        Bucket: bucketName,
        Key: datas.imageName,
      };
      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
      datas.imageName = url;
    }

    if (data) {
      res.json({
        status: "success",
        message: "Fatch Success driver!!",
        data,
      });
      return;
    }
    res.json({
      status: "error",
      message: "Something went wrong, Please try again!!",
    });
  } catch (error) {
    next(error);
  }
});
dashRouter.post("/jobs", async (req, res, next) => {
  try {
    const data = await postJobs(req.body);
    if (data?._id) {
      res.json({
        status: "success",
        message: "Job Added ✅",
      });
      return;
    }
    res.json({
      status: "error",
      message: "Something went wrong, Please try again!!",
    });
  } catch (error) {
    next(error);
  }
});
dashRouter.post("/driver", upload.single("image"), async (req, res, next) => {
  console.log(ascessKey);
  try {
    const prams = {
      Bucket: bucketName,
      Key: imageName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };
    const command = new PutObjectCommand(prams);
    const datas3 = await s3.send(command);

    if (datas3.$metadata.httpStatusCode === 200) {
      const newbody = req.body;
      const postbody = { ...newbody, imageName: imageName };

      const data = await postDriver(postbody);
      if (data?._id) {
        res.json({
          status: "success",
          message: "Driver Added ✅",
        });
        return;
      }
      res.json({
        status: "error",
        message: "Something went wrong, Please try again!!",
      });
    }
  } catch (error) {
    next(error);
  }
});
dashRouter.post("/vehicles", upload.single("image"), async (req, res, next) => {
  try {
    const prams = {
      Bucket: bucketName,
      Key: imageName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };
    const command = new PutObjectCommand(prams);
    const datas3 = await s3.send(command);

    if (datas3.$metadata.httpStatusCode === 200) {
      const newbody = req.body;
      const postbody = { ...newbody, imageName: imageName };

      const data = await postVehicles(postbody);
      if (data?._id) {
        res.json({
          status: "success",
          message: "Vehicle Added ✅",
        });
        return;
      }
      res.json({
        status: "error",
        message: "Something went wrong, Please try again!!",
      });
    }
  } catch (error) {
    next(error);
  }
});
dashRouter.post("/invoice", upload.single("file"), async (req, res, next) => {
  try {
    const prams = {
      Bucket: bucketName,
      Key: imageName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };
    const command = new PutObjectCommand(prams);
    const datas3 = await s3.send(command);

    if (datas3.$metadata.httpStatusCode === 200) {
      const newbody = req.body;
      const postbody = { ...newbody, file: imageName };

      const data = await postInvoice(postbody);
      if (data?._id) {
        const newdata = await getInvoice(data?._id);

        const getObjectParams = {
          Bucket: bucketName,
          Key: newdata.file,
        };
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        newdata.file = url;

        console.log(newdata);
        if (newdata) {
          InvoiceEmail(req.body, newdata);
          res.json({
            status: "success",
            message: "Invoice send✅",
          });
        }
        return;
      }
      res.json({
        status: "error",
        message: "Something went wrong, Please try again!!",
      });
    }
  } catch (error) {
    next(error);
  }
});

dashRouter.post("/cancleJobs", async (req, res, next) => {
  try {
    const jobId = req.body.obj;
    const checkCancle = await findCancle(jobId);

    if (checkCancle.cancle) {
      const updateValue = { cancle: false };
      const data = await jobsFindandUpdate(jobId, updateValue);
      if (data?._id) {
        res.json({
          status: "success",
          message: "Job Resume ✅",
        });
        return;
      }
    } else {
      const updateValue = { cancle: true };
      const data = await jobsFindandUpdate(jobId, updateValue);

      if (data?._id) {
        res.json({
          status: "success",
          message: "Job Cancle ❌",
        });
        return;
      }
    }
    res.json({
      status: "error",
      message: "Something went wrong, Please try again!!",
    });
  } catch (error) {
    next(error);
  }
});

dashRouter.post("/EditJobs", async (req, res, next) => {
  try {
    const data = await jobsFindandUpdate(req.body._id, req.body);
    if (data?._id) {
      res.json({
        status: "success",
        message: "Edit Successfully",
      });
      return;
    }

    res.json({
      status: "error",
      message: "Something went wrong, Please try again!!",
    });
  } catch (error) {
    next(error);
  }
});
dashRouter.post("/findJobs", async (req, res, next) => {
  try {
    const jobId = req.body.obj;
    const checkCancle = await findCancle(jobId);
    if (checkCancle?._id) {
      res.json({
        checkCancle,
      });
      return;
    }

    res.json({
      status: "error",
      message: "Something went wrong, Please try again!!",
    });
  } catch (error) {
    next(error);
  }
});
dashRouter.delete("/deletejobs", async (req, res, next) => {
  try {
    const jobId = req.body;

    const deleted = await deleteJobs(jobId);
    if (deleted) {
      res.json({
        status: "success",
        message: `Successfully deleted ${jobId.length}`,
      });
      return;
    }

    res.json({
      status: "error",
      message: "Something went wrong, Please try again!!",
    });
  } catch (error) {
    next(error);
  }
});

export default dashRouter;
