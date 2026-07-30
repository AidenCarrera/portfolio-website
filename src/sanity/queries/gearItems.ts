import { defineQuery } from "next-sanity";

export const gearItemsQuery = defineQuery(`*[_type == "gearItem"] |
  order(coalesce(sortOrder, 999) asc, name asc) {
    _id,
    name,
    type,
    category,
    manufacturer,
    "sortOrder": coalesce(sortOrder, 999)
  }`);
