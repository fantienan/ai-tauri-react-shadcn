use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
  async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .create_table(
        Table::create()
          .table(OrderProductDetails::Table)
          .if_not_exists()
          .col(pk_uuid(OrderProductDetails::Id))
          .col(integer(OrderProductDetails::CustomerCode))
          .col(text(OrderProductDetails::CustormerType))
          .col(text(OrderProductDetails::Province))
          .col(text(OrderProductDetails::City))
          .col(text(OrderProductDetails::CityLevel))
          .col(text(OrderProductDetails::StoreType))
          .col(integer(OrderProductDetails::StoreCode))
          .col(integer(OrderProductDetails::CustromerCode))
          .col(text(OrderProductDetails::BabyAgeGroup))
          .col(text(OrderProductDetails::Gender))
          .col(text(OrderProductDetails::CrowdType))
          .col(text(OrderProductDetails::OnlineOrder))
          .col(text(OrderProductDetails::PaymentDate))
          .col(text_null(OrderProductDetails::WriteOffDate))
          .col(text_null(OrderProductDetails::AssociatedOrderNumber))
          .col(text(OrderProductDetails::FirstCategory))
          .col(text(OrderProductDetails::SecondaryCategory))
          .col(text(OrderProductDetails::RelatedFirstCategory))
          .col(text(OrderProductDetails::RelatedSecondaryCategory))
          .col(text_null(OrderProductDetails::BrandName))
          .col(text_null(OrderProductDetails::RelatedBrandName))
          .col(text(OrderProductDetails::OnlineCommodityCode))
          .col(text_null(OrderProductDetails::RelatedOnlineCommodityCode))
          .col(text(OrderProductDetails::MarketingCampaignType))
          .col(text(OrderProductDetails::SceneName))
          .col(integer_null(
            OrderProductDetails::PaymentWriteOffDaysDifference,
          ))
          .col(decimal(OrderProductDetails::OnlineSales))
          .col(decimal(OrderProductDetails::RelatedSales))
          .to_owned(),
      )
      .await
  }

  async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .drop_table(Table::drop().table(OrderProductDetails::Table).to_owned())
      .await
  }
}

#[derive(DeriveIden)]
enum OrderProductDetails {
  Table,
  Id,
  CustomerCode,
  CustormerType,
  Province,
  City,
  CityLevel,
  StoreType,
  StoreCode,
  CustromerCode,
  BabyAgeGroup,
  Gender,
  CrowdType,
  OnlineOrder,
  PaymentDate,
  WriteOffDate,
  AssociatedOrderNumber,
  FirstCategory,
  SecondaryCategory,
  RelatedFirstCategory,
  RelatedSecondaryCategory,
  BrandName,
  RelatedBrandName,
  OnlineCommodityCode,
  RelatedOnlineCommodityCode,
  MarketingCampaignType,
  SceneName,
  PaymentWriteOffDaysDifference,
  OnlineSales,
  RelatedSales,
}
