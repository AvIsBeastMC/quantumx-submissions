/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const adminRouter = createTRPCRouter({
  getForEvent: publicProcedure
    .input(z.object({
      eventId: z.string()
    }))
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const {eventId} = input;

      // const check = await db.submission.findMany({
      //   where: {
      //     eventTeam: {
      //       eventId
      //     }
      //   },
      //   include: {
      //     eventTeam: {
      //       include: {
      //         participants: {
      //           select: {
      //             name: true,
      //             class: true
      //           }
      //         },
      //       }
      //     },
      //   }
      // });

      // return check;
    }),
});
