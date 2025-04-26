use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
  async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .create_table(
        Table::create()
          .table(DailySummary::Table)
          .if_not_exists()
          .col(pk_uuid(DailySummary::Id))
          .col(integer(DailySummary::CustomerCode))
          .col(integer(DailySummary::MemberCode))
          .col(text(DailySummary::VisitDate))
          .col(integer(DailySummary::VisitTimePeriod))
          .col(integer(DailySummary::WeixinId))
          .col(integer(DailySummary::Pv))
          .to_owned(),
      )
      .await
  }

  async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .drop_table(Table::drop().table(DailySummary::Table).to_owned())
      .await
  }
}

#[derive(DeriveIden)]
enum DailySummary {
  Table,
  Id,
  CustomerCode,
  MemberCode,
  VisitDate,
  VisitTimePeriod,
  WeixinId,
  Pv,
}
