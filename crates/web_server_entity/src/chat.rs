//! `SeaORM` Entity, @generated by sea-orm-codegen 1.1.11

use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
#[sea_orm(table_name = "chat")]
pub struct Model {
  #[sea_orm(primary_key, auto_increment = false, column_type = "Text")]
  pub id: String,
  #[sea_orm(column_type = "Text")]
  pub created_at: String,
  #[sea_orm(column_type = "Text")]
  pub title: String,
  #[sea_orm(column_type = "Text")]
  pub user_id: String,
  #[sea_orm(column_type = "Text")]
  pub visibility: String,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
  #[sea_orm(has_many = "super::dashboard::Entity")]
  Dashboard,
  #[sea_orm(has_many = "super::message::Entity")]
  Message,
  #[sea_orm(
    belongs_to = "super::user::Entity",
    from = "Column::UserId",
    to = "super::user::Column::Id",
    on_update = "NoAction",
    on_delete = "NoAction"
  )]
  User,
  #[sea_orm(has_many = "super::vote::Entity")]
  Vote,
}

impl Related<super::dashboard::Entity> for Entity {
  fn to() -> RelationDef {
    Relation::Dashboard.def()
  }
}

impl Related<super::user::Entity> for Entity {
  fn to() -> RelationDef {
    Relation::User.def()
  }
}

impl Related<super::vote::Entity> for Entity {
  fn to() -> RelationDef {
    Relation::Vote.def()
  }
}

impl Related<super::message::Entity> for Entity {
  fn to() -> RelationDef {
    super::vote::Relation::Message.def()
  }
  fn via() -> Option<RelationDef> {
    Some(super::vote::Relation::Chat.def().rev())
  }
}

impl ActiveModelBehavior for ActiveModel {}
