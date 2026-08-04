import type { StructureResolver } from "sanity/structure";

const PROFILE_TYPE = "profile";
const PROFILE_ID = "profile";
const ABOUT_PAGE_TYPE = "aboutPage";
const ABOUT_PAGE_ID = "aboutPage";
const RESUME_PAGE_TYPE = "resumePage";
const RESUME_PAGE_ID = "resumePage";

export const structure: StructureResolver = (structureBuilder) =>
  structureBuilder
    .list()
    .title("Portfolio Content")
    .items([
      structureBuilder
        .listItem()
        .id(PROFILE_ID)
        .title("Landing")
        .schemaType(PROFILE_TYPE)
        .child(
          structureBuilder
            .document()
            .schemaType(PROFILE_TYPE)
            .documentId(PROFILE_ID)
            .title("Landing"),
        ),
      structureBuilder
        .listItem()
        .id(ABOUT_PAGE_ID)
        .title("About")
        .schemaType(ABOUT_PAGE_TYPE)
        .child(
          structureBuilder
            .document()
            .schemaType(ABOUT_PAGE_TYPE)
            .documentId(ABOUT_PAGE_ID)
            .title("About"),
        ),
      structureBuilder
        .listItem()
        .id(RESUME_PAGE_ID)
        .title("Resume")
        .schemaType(RESUME_PAGE_TYPE)
        .child(
          structureBuilder
            .document()
            .schemaType(RESUME_PAGE_TYPE)
            .documentId(RESUME_PAGE_ID)
            .title("Resume"),
        ),
      ...structureBuilder
        .documentTypeListItems()
        .filter(
          (item) =>
            item.getId() !== PROFILE_TYPE &&
            item.getId() !== ABOUT_PAGE_TYPE &&
            item.getId() !== RESUME_PAGE_TYPE,
        ),
    ]);
