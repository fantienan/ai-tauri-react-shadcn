import { type InferSelectModel, sql } from 'drizzle-orm'
import { integer, primaryKey, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { v4 as uuidv4 } from 'uuid'

export const orderProductDetails = sqliteTable('order_product_details', {
  客户编码: integer('客户编码'),
  客户类型: text('客户类型', { length: 255 }),
  省份: text('省份', { length: 255 }),
  城市: text('城市', { length: 255 }),
  城市等级: text('城市等级', { length: 255 }),
  门店类型: text('门店类型', { length: 255 }),
  门店编码: integer('门店编码'),
  会员编码: integer('会员编码'),
  宝宝年龄段: text('宝宝年龄段', { length: 255 }),
  性别: text('性别', { length: 255 }),
  人群分类: text('人群分类', { length: 255 }),
  线上订单号: text('线上订单号', { length: 255 }),
  支付日期: text('支付日期', { length: 255 }),
  核销日期: text('核销日期', { length: 255 }),
  关联订单号: text('关联订单号', { length: 255 }),
  '1级品类': text('1级品类', { length: 255 }),
  '2级品类': text('2级品类', { length: 255 }),
  连带1级品类: text('连带1级品类', { length: 255 }),
  连带2级品类: text('连带2级品类', { length: 255 }),
  品牌名称: text('品牌名称', { length: 255 }),
  连带品牌名称: text('连带品牌名称', { length: 255 }),
  线上商品编码: text('线上商品编码', { length: 255 }),
  连带商品编码: text('连带商品编码', { length: 255 }),
  营销活动类型: text('营销活动类型', { length: 255 }),
  场景名称: text('场景名称', { length: 255 }),
  支付核销天数差: integer('支付核销天数差'),
  线上销售额: real('线上销售额'),
  连带销售额: real('连带销售额'),
})

export const dailySummary = sqliteTable('daily_summary', {
  客户编码: integer('客户编码'),
  会员编码: integer('会员编码'),
  访问日期: text('访问日期', { length: 255 }),
  访问时段: integer('访问时段'),
  微信场景id: integer('微信场景ID'),
  pv: integer('PV'),
})

export const user = sqliteTable('user', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$defaultFn(() => uuidv4()),
  email: text('email', { length: 64 }).notNull(),
  password: text('password', { length: 64 }),
})

export type User = InferSelectModel<typeof user>

export const chat = sqliteTable('chat', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$defaultFn(() => uuidv4()),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  title: text('title').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
})

export type Chat = InferSelectModel<typeof chat>

export const message = sqliteTable('message', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$defaultFn(() => uuidv4()),
  chatId: text('chat_id')
    .notNull()
    .references(() => chat.id),
  role: text('role').notNull(),
  parts: text('parts', { mode: 'json' }).notNull(),
  attachments: text('attachments', { mode: 'json' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
})

export type DBMessage = InferSelectModel<typeof message>

export const vote = sqliteTable(
  'vote',
  {
    chatId: text('chat_id')
      .notNull()
      .references(() => chat.id),
    messageId: text('message_id')
      .notNull()
      .references(() => message.id),
    isUpvoted: integer('is_upvoted', { mode: 'boolean' }).notNull(),
  },
  (table) => [primaryKey({ name: 'pk', columns: [table.chatId, table.messageId] })],
)

export type Vote = InferSelectModel<typeof vote>
