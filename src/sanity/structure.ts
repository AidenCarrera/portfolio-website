import type { StructureResolver } from "sanity/structure";

const PROFILE_TYPE = "profile";
const PROFILE_ID = "profile";

export const structure: StructureResolver = (structureBuilder) =>
  structureBuilder
    .list()
    .title("Portfolio Content")
    .items([
      structureBuilder
        .listItem()
        .id(PROFILE_ID)
        .title("Profile")
        .schemaType(PROFILE_TYPE)
        .child(
          structureBuilder
            .document()
            .schemaType(PROFILE_TYPE)
            .documentId(PROFILE_ID)
            .title("Profile"),
        ),
      ...structureBuilder
        .documentTypeListItems()
        .filter((item) => item.getId() !== PROFILE_TYPE),
    ]);
