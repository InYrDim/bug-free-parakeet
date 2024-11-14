import { Client, NoAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

// Create a new client instance
const client = new Client({
  authStrategy: new NoAuth(),
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

//when client receive message, check the message if its from specific whatsapp group and that specific group send an image, do some stuf
client.on("message", async (message) => {
  const chat = await message.getChat();

  //check if message coming from a group chat
  if (chat.isGroup && !chat.archived) {
    const groupName = chat.name;
    const groupId = chat.id.user;
    const serializedChatId = chat.id._serialized;

    // "120363150302477706" : Infinite
    // "120363347179159618" : Testing

    const allowedGroup = ["120363347179159618", "120363150302477706"];

    //check if message is from allowed group
    if (!allowedGroup.includes(groupId)) {
      console.log("Group: ", groupId, " Is not allowed");
      return;
    }

    console.log("ID: " + groupId, "Name: " + groupName);
    if (message.hasMedia) {
      if (message.type === "image") {
        const mediaData = await message.downloadMedia();

        const { data } = mediaData;

        const formData = new FormData();
        formData.append("image", data);

        const apiKey = "8538d544e1a7113d1a45b046b9aa126e";
        const response = await fetch(
          `https://api.imgbb.com/1/upload?key=${apiKey}`,
          {
            method: "POST",
            body: formData,
          }
        );

        const uploadStatus = await response.json();

        if (uploadStatus.success) {
          console.log("Succesfully Uploading Image!");
        }
      }
    }
  }
});

// Start your client
client.initialize();
