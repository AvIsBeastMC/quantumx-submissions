/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { TRPCError } from "@trpc/server";
import axios, { AxiosResponse } from "axios";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const adminRouter = createTRPCRouter({
  list: publicProcedure
    .input(z.string().optional())
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const event = input;

      try {
        const allDataQuery: AxiosResponse<{
          raw: {
            id: string;
            dateAdded: string;
            submitted: boolean;
            eventDivisionId: string | null;
            eventSubCategoryId: string | null;
            eventId: string;
            schoolId: string;
            students: {
              id: number;
              name: string;
              class: string;
              phone: string;
              discord: string | null;
              eventRegistrationId: string;
            }[];
            teamHead: string | null;
            eventDivision: {
              id: string;
              title: string;
              subTitle: string;
              eventId: string;
            } | null;
            event: {
              id: string;
              name: string;
            };
            eventSubCategory: {
              id: string;
              title: string;
              eventId: string;
            } | null;
            school: {
              name: string;
              type: string;
              password: string;
              dateAdded: string;
              teacherInCharge: {
                id: string;
                name: string;
                phone: string;
                email: string;
                schoolName: string;
              };
            };
          }[]
        }> = await axios.get('https://register.thequantumx.xyz/api/scripts/data');

        const query = await db.submission.findMany({
          where: {
            event
          }
        });

        const queryMapped = query.map((q) => {
          const moreData = allDataQuery.data.raw.find((data) => data.id == q.eventRegistrationId);

          return {
            ...q,
            moreData
          }
        });

        return queryMapped;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Unknown Error Occurred while fetching.'
        })
      }
    }),
  login: publicProcedure.input(z.object({
    username: z.string(),
    password: z.string()
  })).mutation(async ({ ctx, input }) => {
    const { db } = ctx;
    const { username, password } = input;

    const usernameCorrect = ['neha.arora', 'arunnya.varma'].includes(username);
    const passwordCorrect = ['ais85', 'arunnya.varma'].includes(password);

    return (usernameCorrect && passwordCorrect);
  }),
  getForEvent: publicProcedure
    .input(z.object({
      eventId: z.string()
    }))
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { eventId } = input;

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
