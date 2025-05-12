import { ContainerModule } from 'inversify';
import { CommentService } from './comment-service.js';
import { ICommentService } from './comment-service.interface.js';
import { CommentDbo } from './comment.dbo.js';

export function setupCommentsDIContainer(): ContainerModule {
  return new ContainerModule((bind) => {
    bind.bind<ICommentService>('CommentService').to(CommentService);
    bind.bind(Symbol.for('CommentModel')).toConstantValue(CommentDbo);
  });
}
