import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('media')
@UseGuards(JwtAuthGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: { user: { id: string } }
  ) {
    return this.mediaService.upload(file, req.user.id);
  }

  @Get()
  async findAll(
    @Query('page') page = '1',
    @Query('perPage') perPage = '20'
  ) {
    return this.mediaService.findAll(
      parseInt(page, 10),
      parseInt(perPage, 10)
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.mediaService.remove(id);
  }
}
