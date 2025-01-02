import { ApiProperty } from '@nestjs/swagger';

export class OrderItemSearchDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  quantidade: number;

  @ApiProperty()
  precoVenda: number;

  @ApiProperty()
  productId: number;
}
