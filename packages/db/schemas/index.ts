import {
  index,
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const locations = sqliteTable(
  "locations",
  {
    id: text("id").primaryKey(),
    city: text("city").notNull(),
    province: text("province").notNull(),
    country: text("country").notNull(),
    displayName: text("display_name").notNull(),
  },
  (table) => [index("locations_city_idx").on(table.city)]
);

export const propertyTypes = sqliteTable(
  "property_types",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
  },
  (table) => [uniqueIndex("property_types_slug_idx").on(table.slug)]
);

export const hosts = sqliteTable("hosts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url").notNull(),
  joinedYear: integer("joined_year").notNull(),
  isSuperhost: integer("is_superhost", { mode: "boolean" })
    .notNull()
    .default(false),
});

export const amenities = sqliteTable(
  "amenities",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    iconName: text("icon_name").notNull(),
  },
  (table) => [uniqueIndex("amenities_name_idx").on(table.name)]
);

export const properties = sqliteTable(
  "properties",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    description: text("description").notNull(),
    locationId: text("location_id")
      .notNull()
      .references(() => locations.id, { onDelete: "restrict" }),
    propertyTypeId: text("property_type_id")
      .notNull()
      .references(() => propertyTypes.id, { onDelete: "restrict" }),
    hostId: text("host_id")
      .notNull()
      .references(() => hosts.id, { onDelete: "restrict" }),
    pricePerNight: integer("price_per_night").notNull(),
    rating: real("rating").notNull(),
    reviewCount: integer("review_count").notNull().default(0),
    maxGuests: integer("max_guests").notNull(),
    bedrooms: integer("bedrooms").notNull(),
    beds: integer("beds").notNull(),
    bathrooms: integer("bathrooms").notNull(),
    isGuestFavorite: integer("is_guest_favorite", { mode: "boolean" })
      .notNull()
      .default(false),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    uniqueIndex("properties_slug_idx").on(table.slug),
    index("properties_location_idx").on(table.locationId),
    index("properties_type_idx").on(table.propertyTypeId),
    index("properties_price_idx").on(table.pricePerNight),
    index("properties_rating_idx").on(table.rating),
  ]
);

export const propertyImages = sqliteTable(
  "property_images",
  {
    id: text("id").primaryKey(),
    propertyId: text("property_id")
      .notNull()
      .references(() => properties.id, { onDelete: "cascade" }),
    imageUrl: text("image_url").notNull(),
    altText: text("alt_text").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    isCover: integer("is_cover", { mode: "boolean" }).notNull().default(false),
  },
  (table) => [
    index("property_images_property_order_idx").on(
      table.propertyId,
      table.sortOrder
    ),
  ]
);

export const propertyAmenities = sqliteTable(
  "property_amenities",
  {
    propertyId: text("property_id")
      .notNull()
      .references(() => properties.id, { onDelete: "cascade" }),
    amenityId: text("amenity_id")
      .notNull()
      .references(() => amenities.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.propertyId, table.amenityId] }),
    index("property_amenities_amenity_idx").on(table.amenityId),
  ]
);

export const wishlistStates = sqliteTable("wishlist_states", {
  propertyId: text("property_id")
    .primaryKey()
    .references(() => properties.id, { onDelete: "cascade" }),
  isWishlisted: integer("is_wishlisted", { mode: "boolean" })
    .notNull()
    .default(false),
});
