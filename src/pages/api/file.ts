/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { IncomingForm } from "formidable";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  }
};

const post = (req: NextApiRequest, res: NextApiResponse) => {
  const uuid = crypto.randomUUID();

  const form = new IncomingForm({
    uploadDir: `./public/submissions/${uuid}`,
    keepExtensions: true,
    createDirsFromUploads: true,
    maxTotalFileSize: 5368709120,
    maxFileSize: 5368709120
  });
  
  let filePaths: string[] = []

  form.on('file', (t, f) => {
    filePaths.push(f.newFilename)
  })

  form.parse(req, (err, field, file) => {
    if (err) {
      console.log('[FILES ERROR] An Error Occurred');
      console.log(err);
      res.status(500).send(err);
    }

    console.log('[FILES] Files were uploaded: ' + uuid);

    return res.status(200).json({ message: filePaths, uuid });
  });
};

const saveFile = (file: any) => {
  const data = fs.readFileSync(file as any);
  fs.writeFileSync(`./public/documents/${file.name}`, data);
  fs.unlinkSync(file.path);
  return;
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  req.method === "POST"
    ? post(req, res)
    : req.method === "PUT"
    ? console.log("PUT")
    : req.method === "DELETE"
    ? console.log("DELETE")
    : req.method === "GET"
    ? console.log("GET")
    : res.status(404).send("");
};
