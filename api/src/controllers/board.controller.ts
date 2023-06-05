import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Body,
  HttpStatus,
  UploadedFile,
  ParseFilePipeBuilder,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import CreatePostDto from 'src/dto/create.post.dto';
import bytes from 'bytes';
import BoardService from 'src/services/board.service';
import JwtAuthGuard from 'src/guards/jwt-auth.guard';
import RecordingPost from 'src/models/post.model';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('board')
@Controller('board')
@ApiBearerAuth()
export default class BoardController {
  constructor(private readonly boardService: BoardService) { }

  @Get('query')
  @ApiOkResponse({
    description: 'Successfully queried posts',
    type: RecordingPost,
    isArray: true
  })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  async query(): Promise<RecordingPost[]> {
    return this.boardService.query();
  }

  @UseGuards(JwtAuthGuard)
  @Post('like/:postId')
  @ApiOkResponse({
    description: 'Successfully liked the post',
    type: RecordingPost
  })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  async like(@Param('id') postId: number, @Request() req): Promise<RecordingPost> {
    return await this.boardService.like(req.user, postId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('unlike/:postId')
  @ApiOkResponse({
    description: 'Successfully unlike the post',
    type: RecordingPost
  })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  async unlike(@Param('id') postId: number, @Request() req): Promise<RecordingPost> {
    return await this.boardService.unlike(req.user, postId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('recording')
  @ApiOkResponse({
    description: 'Successfully unlike the post',
    type: CreatePostDto
  })
  @UseInterceptors(FileInterceptor('file'))
  async createPost(
    @Body() post: CreatePostDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'mp3',
        })
        .addMaxSizeValidator({
          maxSize: bytes("5mb")
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
        }),
    )
    recording: Express.Multer.File,
    @Request() req
  ): Promise<RecordingPost> {
    return await this.boardService.createPost(req.user, post, recording);
  }
}