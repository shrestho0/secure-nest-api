import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PaymentModule } from './payment/payment.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';


@Module({
  imports: [AuthModule, UserModule, PaymentModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60_000,
          limit: 100, // max 100 req/m
        },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    }
  ],
})
export class AppModule { }
