const express = require("express");
const cors = require("cors");
const http = require("http");
const app = express();
const port = 8080;
const Documents = require("./models/documents/Documents");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
require("dotenv").config();

// Route Imports
const authRoutes = require("./routes/auth/authRoutes");
const documentRoutes = require("./routes/document/documentRoutes");
const templateRoutes = require("./routes/template/templateRoutes");
const userRoutes = require("./routes/user/userRoutes");
const Templates = require("./models/templates/Templates");

const server = http.createServer(app);

const io = new Server(server, {
  path: "/socket.io", // Default path
  cors: {
    // TODO: Change when front-end is hosted.
    origin: "*",
    methods: ["GET", "POST"],
  },
});

mongoose
  .connect(process.env.DB_CONNECTION_STRING, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB", error));

app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  socket.on("get-document", async (documentData) => {
    const document = await findOrCreateDocument(
      documentData.docReference,
      documentData.userId,
      documentData.templateId
    );
    socket.join(documentData.docReference);

    socket.emit("load-document", {
      data: document.data,
      name: document.name,
    });

    socket.on("send-changes", (delta) => {
      socket.broadcast
        .to(documentData.docReference)
        .emit("receive-changes", delta);
    });

    socket.on("save-document", async (quillData) => {
      await Documents.findByIdAndUpdate(documentData.docReference, {
        data: quillData,
        modifiedAt: Date.now(),
      });
    });

    socket.on(
      `update-document-${documentData.docReference}-details`,
      async (documentName) => {
        await Documents.findByIdAndUpdate(documentData.docReference, {
          name: documentName,
        });
      }
    );
  });

  socket.on("get-template", async (templateData) => {
    const template = await findOrCreateTemplate(
      templateData.docReference,
      templateData.userId
    );
    socket.join(templateData.docReference);

    socket.emit("load-template", {
      data: template.data,
      name: template.name,
    });

    socket.on("send-changes", (delta) => {
      socket.broadcast
        .to(templateData.docReference)
        .emit("receive-changes", delta);
    });

    socket.on("save-template", async (quillData) => {
      await Templates.findByIdAndUpdate(templateData.docReference, {
        data: quillData,
        modifiedAt: Date.now(),
      });
    });

    socket.on(
      `update-template-${templateData.docReference}-details`,
      async (templateName) => {
        await Templates.findByIdAndUpdate(templateData.docReference, {
          name: templateName,
        });
      }
    );
  });
});

const findOrCreateDocument = async (id, userId, templateId) => {
  if (!id) {
    return;
  }
  const document = await Documents.findById(id);
  const documentTemplate = await Templates.findById(templateId);

  if (document) {
    return document;
  }
  const doc = new Documents({
    _id: id,
    data: documentTemplate.data,
    user: userId,
    templateId: templateId,
    createAt: Date.now(),
    modifiedAt: Date.now(),
  });
  const result = await doc.save();
  return result;
};

const findOrCreateTemplate = async (id, userId) => {
  if (!id) {
    return;
  }
  const document = await Templates.findById(id);

  if (document) {
    return document;
  }

  const doc = new Templates({
    _id: id,
    data: "",
    user: userId,
    createAt: Date.now(),
    modifiedAt: Date.now(),
  });
  const result = await doc.save();
  return result;
};

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
