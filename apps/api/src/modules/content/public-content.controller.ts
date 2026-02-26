import { Controller, Get, Param, Query } from '@nestjs/common';
import { ContentService } from './content.service';

@Controller('public/content')
export class PublicContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get(':type')
  async findAll(
    @Param('type') type: string,
    @Query('page') page = '1',
    @Query('perPage') perPage = '20',
    @Query('search') search?: string,
    @Query('sort') sort = 'createdAt',
    @Query('order') order = 'desc'
  ) {
    return this.contentService.findAllPublic(type, {
      page: parseInt(page, 10),
      perPage: parseInt(perPage, 10),
      search,
      sort,
      order: order as 'asc' | 'desc',
    });
  }

  @Get(':type/:id')
  async findOne(@Param('type') type: string, @Param('id') id: string) {
    return this.contentService.findOnePublic(type, id);
  }
}
