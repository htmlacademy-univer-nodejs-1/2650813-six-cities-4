import {Container} from 'inversify';
import {CommentServiceInterface} from './comment-service.interface';
import {AppComponent} from '../../../types/app-component.enum.js';
import {types} from '@typegoose/typegoose';
import {CommentEntity, CommentModel} from './comment.entity.js';
import {CommentService} from './comment.service.js';
import CommentController from './controller/comment-controller.js';

export function CreateCommentContainer() {
  const commentContainer = new Container();
  commentContainer.bind<CommentServiceInterface>(AppComponent.CommentServiceInterface).to(CommentService).inSingletonScope();
  commentContainer.bind<types.ModelType<CommentEntity>>(AppComponent.CommentModel).toConstantValue(CommentModel);
  commentContainer.bind<CommentController>(AppComponent.CommentController).to(CommentController).inSingletonScope();
  return commentContainer;
}
