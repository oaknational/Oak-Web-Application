import { Client as HubspotClient } from "@hubspot/api-client";

const hubspot = new HubspotClient({
  accessToken: getServerConfig("hubspotFormsAccessToken"),
});

export default async function handler(req, res) {
  const contactId = req.body.email;
  const properties = [];
  const propertiesWithHistory = undefined;
  const associations = undefined;
  const archived = false;
  const idProperty = "email";

  try {
    //   we have to include all the fields even though they are undefined or the fetch fails.
    const apiResponse = await hubspot.crm.contacts.basicApi.getById(
      contactId,
      properties,
      propertiesWithHistory,
      associations,
      archived,
      idProperty,
    );

    return res.status(200).json(apiResponse.properties.email);
  } catch (error) {
    console.log("error", error.code);
    if (error.code === 404) {
      console.log("Contact not found (400 error)");
      return res.status(200).json(null);
    } else if (error.code === 500) {
      console.log("500 error");
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
