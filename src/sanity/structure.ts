import type { StructureResolver } from "sanity/structure";

// Each of these is both the schema type and the id of its one singleton
// document, so the Studio always edits the same document for that type.
const PROFILE = "profile";
const ABOUT_PAGE = "aboutPage";
const RESUME_PAGE = "resumePage";

export const structure: StructureResolver = (structureBuilder) =>
  structureBuilder
    .list()
    .title("Portfolio Content")
    .items([
      structureBuilder
        .listItem()
        .id(PROFILE)
        .title("Landing")
        .schemaType(PROFILE)
        .child(
          structureBuilder
            .document()
            .schemaType(PROFILE)
            .documentId(PROFILE)
            .title("Landing"),
        ),
      structureBuilder
        .listItem()
        .id(ABOUT_PAGE)
        .title("About")
        .schemaType(ABOUT_PAGE)
        .child(
          structureBuilder
            .document()
            .schemaType(ABOUT_PAGE)
            .documentId(ABOUT_PAGE)
            .title("About"),
        ),
      structureBuilder
        .listItem()
        .id(RESUME_PAGE)
        .title("Resume")
        .schemaType(RESUME_PAGE)
        .child(
          structureBuilder
            .document()
            .schemaType(RESUME_PAGE)
            .documentId(RESUME_PAGE)
            .title("Resume"),
        ),
      ...structureBuilder
        .documentTypeListItems()
        .filter(
          (item) =>
            item.getId() !== PROFILE &&
            item.getId() !== ABOUT_PAGE &&
            item.getId() !== RESUME_PAGE,
        ),
    ]);
