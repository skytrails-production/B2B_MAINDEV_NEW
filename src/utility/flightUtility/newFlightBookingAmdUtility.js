import { XMLParser } from "fast-xml-parser";
export const convertXmlToJson = (xmlData) => {
  const parser = new XMLParser();
  const result = parser.parse(xmlData);

  let convertData;
  if (xmlData !== "") {
    convertData =
      result["soapenv:Envelope"]["soapenv:Body"][
        "Air_SellFromRecommendationReply"
      ];
    return convertData; // Set the JSON data using the passed setter
  }
};
