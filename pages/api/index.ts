// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import * as htmlparser2 from "htmlparser2";
import axios from "axios";
import { selectAll } from "css-select";

type Data = {
  name: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (!process.env.MENU_PROVIDER) {
    res.status(500).json({ name: "No menu provider set" });
    return;
  }

  const response = await axios.get(process.env.MENU_PROVIDER);

  if (response.status !== 200 || !response.data) {
    res.status(500).json({ name: "Failed to fetch menu" });
    return;
  }

  const dom = htmlparser2.parseDocument(response.data);

  const menu = selectAll(".menicka_detail .hlavicka .info .nazev", dom).map((item) => {
    return item.childNodes[0];
  });

  console.log(menu);

  res.status(200).json({ name: "John Doe" });
}
