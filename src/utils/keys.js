export const IDS_KEY = "filterIds";
export const PHOTOS_KEY = "/photos";

// Ключи полей, по которым будем получать информацию
export const FIELD_KEYS = [
  "ID",
  "TITLE",
  "STAGE_SEMANTIC_ID",
  "STAGE_ID",
  "ASSIGNED_BY_ID",
  "DATE_CREATE",
  "CREATED_BY_ID",
  "CATEGORY_ID",
  "CURRENCY_ID",
  "OPPORTUNITY",
  "CLOSEDATE",
  "SOURCE_ID",
  "UTM_SOURCE",
  "LEAD_ID",
];

export const BASE_URL = import.meta.env.VITE_BASE_URL;

// URL для запроса данных о сделках
export const FIELDS_URL = `${BASE_URL}/j4fqiexr8k1d8uex/crm.deal.fields.json`;
export const STATUS_URL = `${BASE_URL}/o33j00w6adnmszcb/crm.status.list.json`;
export const USERS_URL = `${BASE_URL}/hkgrs3hxcv9883wx/user.get.json`;
export const DEALS_URL = `${BASE_URL}/g1nu0lax58zlv3ly/crm.deal.list.json`;
export const CATEGORIES_URL = `${BASE_URL}/mod3zsgo22fjw44t/crm.category.list.json?entityTypeId=2`;
