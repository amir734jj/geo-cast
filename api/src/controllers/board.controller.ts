import {
  Controller,
  Get,
  Request,
  Post,
  Delete,
  UseGuards,
  Body,
  HttpStatus,
  ForbiddenException,
  UploadedFile,
  ParseFilePipeBuilder,
  Param,
  UseInterceptors,
  StreamableFile,
  Header,
  Query
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger';
import CreatePostDto, { CreatePostDtoType } from 'src/dto/create.post.dto';
import bytes from 'bytes';
import BoardService from 'src/services/board.service';
import JwtAuthGuard from 'src/guards/jwt-auth.guard';
import RecordingPost from 'src/models/post.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { FormDataBody, FormDataDtoValidator } from 'src/decorators/form-data.decorator';
import CreateUserDto from 'src/dto/create.user.dto';
import { TypeTransformer } from 'src/decorators/type-transformer.decorator';
import QueryPostDto from '../dto/query.post.dto';
import { isAdmin } from '@geo-cast/lib/utils';
import { MAX_RECORDING_SIZE } from '@geo-cast/lib/constants';

@ApiTags('board')
@Controller('board')
@ApiBearerAuth()
export default class BoardController {
  constructor (private readonly boardService: BoardService) {
  }

  @Get('download/:recordingId')
  @ApiOkResponse({
    description: 'Successfully returned the recording file',
    type: StreamableFile
  })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  @Header('Cache-Control', 'public, max-age=31536000, immutable')
  @Header('Content-Disposition', 'attachment; filename=voice.wav')
  async download (@Param('recordingId') recordingId: string) {
    const { readable } = await this.boardService.downloadRecording(recordingId);
    return new StreamableFile(readable);
  }

  @Get('query')
  @ApiOkResponse({
    description: 'Successfully queried posts',
    type: RecordingPost,
    isArray: true
  })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  async query (@Query() query: QueryPostDto): Promise<RecordingPost[]> {
    return await this.boardService.query(query.count, query.page, { longitude: query.longitude, latitude: query.latitude });
  }

  @UseGuards(JwtAuthGuard)
  @Post('like/:postId')
  @ApiOkResponse({
    description: 'Successfully liked the post',
    type: RecordingPost
  })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  async like (@Param('postId') postId: number, @Request() req): Promise<RecordingPost> {
    return await this.boardService.like(req.user, postId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('unlike/:postId')
  @ApiOkResponse({
    description: 'Successfully unlike the post',
    type: RecordingPost
  })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  async unlike (@Param('postId') postId: number, @Request() req): Promise<RecordingPost> {
    return await this.boardService.unlike(req.user, postId);
  }

  @Get('stats')
  @ApiOkResponse({
    description: 'Successfully returned recording statistics per country'
  })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  async stats (): Promise<{country: string; count: number}[]> {
    return await this.boardService.getStats();
  }

  @Get('user/:userId')
  @ApiOkResponse({
    description: 'Successfully returned user posts',
    type: RecordingPost,
    isArray: true
  })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  async getUserPosts (@Param('userId') userId: number): Promise<RecordingPost[]> {
    return await this.boardService.getUserPosts(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':postId')
  @ApiOkResponse({
    description: 'Successfully deleted the post'
  })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  async deletePost (@Param('postId') postId: number, @Request() req): Promise<void> {
    const isAdmin = req.user?.roles?.some((r: any) => r.name === 'admin');
    const isOwner = await this.boardService.isPostOwner(req.user.id, postId);
    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('You can only delete your own recordings');
    }
    await this.boardService.deletePost(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('recording')
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    description: 'Successfully unlike the post',
    type: CreatePostDto
  })
  @UseInterceptors(FileInterceptor('file'))
  @FormDataDtoValidator()
  async createPost (
    @FormDataBody(CreateUserDto)
    @Body(new TypeTransformer(CreatePostDto)) post: CreatePostDtoType,
      @UploadedFile(
        new ParseFilePipeBuilder()
          .addFileTypeValidator({
            fileType: /^(audio\/(wav|wave|mpeg|mp3|ogg|webm|x-wav)|application\/octet-stream)$/
          })
          .addMaxSizeValidator({
            maxSize: bytes(MAX_RECORDING_SIZE) as number
          })
          .build({
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            fileIsRequired: true
          })
      )
      recording: Express.Multer.File,
      @Request() req
  ): Promise<RecordingPost> {
    return await this.boardService.createPost(req.user, post, recording);
  }
}
