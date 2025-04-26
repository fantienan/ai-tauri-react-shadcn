import { sql } from 'drizzle-orm'
import { AnySQLiteColumn, foreignKey, integer, primaryKey, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const vote = sqliteTable(
  'vote',
  {
    chatId: text('chat_id')
      .notNull()
      .references(() => chat.id),
    messageId: text('message_id')
      .notNull()
      .references(() => message.id),
    isUpvoted: integer('is_upvoted').notNull(),
  },
  (table) => [primaryKey({ columns: [table.chatId, table.messageId], name: 'vote_chat_id_message_id_pk' })],
)

export const chat = sqliteTable('chat', {
  id: text().primaryKey().notNull(),
  createdAt: text('created_at').notNull(),
  title: text().notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  visibility: text().default('private').notNull(),
})

export const message = sqliteTable('message', {
  id: text().primaryKey().notNull(),
  chatId: text('chat_id')
    .notNull()
    .references(() => chat.id),
  role: text().notNull(),
  parts: text().notNull(),
  attachments: text().notNull(),
  createdAt: text('created_at').notNull(),
})

export const user = sqliteTable('user', {
  id: text().primaryKey().notNull(),
  email: text({ length: 64 }).notNull(),
  password: text({ length: 64 }),
  createdAt: text('created_at').notNull(),
})

export const dailySummary = sqliteTable('daily_summary', {
  id: text().primaryKey().notNull(),
  customerCode: integer('customer_code'),
  memberCode: integer('member_code'),
  visitDate: text('visit_date', { length: 255 }),
  visitTimePeriod: integer('visit_time_period'),
  weixinId: integer('weixin_id'),
  pv: integer(),
})

export const orderProductDetails = sqliteTable('order_product_details', {
  id: text().primaryKey().notNull(),
  customerCode: integer('customer_code'),
  custormerType: text('custormer_type', { length: 255 }),
  province: text({ length: 255 }),
  city: text({ length: 255 }),
  cityLevel: text('city_level', { length: 255 }),
  storeType: text('store_type', { length: 255 }),
  storeCode: integer('store_code'),
  custromerCode: integer('custromer_code'),
  babyAgeGroup: text('baby_age_group', { length: 255 }),
  gender: text({ length: 255 }),
  crowdType: text('crowd_type', { length: 255 }),
  onlineOrder: text('online_order', { length: 255 }),
  paymentDate: text('payment_date', { length: 255 }),
  writeOffDate: text('write_off_date', { length: 255 }),
  associatedOrderNumber: text('associated_order_number', { length: 255 }),
  firstCategory: text('first_category', { length: 255 }),
  secondaryCategory: text('secondary_category', { length: 255 }),
  relatedFirstCategory: text('related_first_category', { length: 255 }),
  relatedSecondaryCategory: text('related_secondary_category', { length: 255 }),
  brandName: text('brand_name', { length: 255 }),
  relatedBrandName: text('related_brand_name', { length: 255 }),
  onlineCommodityCode: text('online_commodity_code', { length: 255 }),
  relatedOnlineCommodityCode: text('related_online_commodity_code', { length: 255 }),
  marketingCampaignType: text('marketing_campaign_type', { length: 255 }),
  sceneName: text('scene_name', { length: 255 }),
  paymentWriteOffDaysDifference: integer('payment_write_off_days_difference'),
  onlineSales: real('online_sales'),
  relatedSales: real('related_sales'),
})
