import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ContentService } from './content.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('content')
@UseGuards(JwtAuthGuard)
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get(':type')
  async findAll(
    @Param('type') type: string,
    @Query('page') page = '1',
    @Query('perPage') perPage = '20',
    @Query('status') status?: string,
    @Query('visibility') visibility?: string,
    @Query('search') search?: string,
    @Query('sort') sort = 'createdAt',
    @Query('order') order = 'desc'
  ) {
    return this.contentService.findAll(type, {
      page: parseInt(page, 10),
      perPage: parseInt(perPage, 10),
      status,
      visibility,
      search,
      sort,
      order: order as 'asc' | 'desc',
    });
  }

  @Get(':type/:id')
  async findOne(@Param('type') type: string, @Param('id') id: string) {
    return this.contentService.findOne(type, id);
  }

  @Post(':type')
  async create(
    @Param('type') type: string,
    @Body()
    body: {
      data: Record<string, unknown>;
      visibility?: 'PUBLIC' | 'RESTRICTED';
    },
    @Request() req: { user: { id: string } }
  ) {
    return this.contentService.create(
      type,
      body.data,
      req.user.id,
      body.visibility
    );
  }

  @Put(':type/:id')
  async update(
    @Param('type') type: string,
    @Param('id') id: string,
    @Body() body: { data: Record<string, unknown> }
  ) {
    return this.contentService.update(type, id, body.data);
  }

  @Patch(':type/:id/status')
  async updateStatus(
    @Param('type') type: string,
    @Param('id') id: string,
    @Body() body: { status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' }
  ) {
    return this.contentService.updateStatus(type, id, body.status);
  }

  @Patch(':type/:id/visibility')
  async updateVisibility(
    @Param('type') type: string,
    @Param('id') id: string,
    @Body() body: { visibility: 'PUBLIC' | 'RESTRICTED' }
  ) {
    return this.contentService.updateVisibility(type, id, body.visibility);
  }

  @Delete(':type/:id')
  async remove(@Param('type') type: string, @Param('id') id: string) {
    return this.contentService.remove(type, id);
  }
}
