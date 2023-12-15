import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { trace, context as opentelemetryContext, propagation } from '@opentelemetry/api';

const tracer = trace.getTracer('service-to-trance-http-requests');

@Injectable()
export class GlobalTracerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const requestUrl = context.switchToHttp().getRequest().url;
    const requestBody = context.switchToHttp().getRequest().body;

    tracer.startActiveSpan('span-for-request', (span) => {
      span.setAttribute('requestUrl', requestUrl);
      span.setAttribute('requestBody', JSON.stringify(requestBody));
      span.end();
    });

    return next.handle().pipe(
      tap(() => {
        // TODO: can not get response body
        const responseBody = context.switchToHttp().getResponse().body;

        tracer.startActiveSpan('span-for-response', (span) => {
          span.setAttribute('requestUrl', requestUrl);
          span.setAttribute('responseBody', JSON.stringify(responseBody));
          span.end();
        });
      }),
    );
  }
}
