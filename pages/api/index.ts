// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import * as htmlparser2 from "htmlparser2";
import axios from "axios";
import { selectAll, selectOne } from "css-select";

type ServerError = {
  error: string;
};

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.MENU_PROVIDER) {
    res.status(500).json({ error: "No menu provider set" });
    return;
  }

  try {
    const response = await axios.get(process.env.MENU_PROVIDER, {
      responseType: "arraybuffer",
      responseEncoding: "binary",
    });

    const decoded = new TextDecoder("windows-1250").decode(response.data);

    const menu = selectAll(".menicka_detail", htmlparser2.parseDocument(decoded)).map((item) => {
      const name = selectOne(".nazev", item)?.children[0];

      if (name && "children" in name) {
        if ("data" in name.children[0]) {
          return JSON.parse(JSON.stringify(name.children[0].data));
        }

        return "N/A";
      }

      return "name";
    });

    res.setHeader("content-type", "application/json;charset=utf-8").status(200).json({ menu });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch menu" });
  }
}
