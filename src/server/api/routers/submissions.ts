/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import axios, { AxiosResponse } from 'axios'
import { TRPCError } from "@trpc/server";

export const submissionsRouter = createTRPCRouter({
  submit: publicProcedure
    .input(z.object({
      team: z.string(),
      // inputs
      title: z.string(),
      description: z.string().optional(),
      links: z.string().array(),
      files: z.string().array(),
      folderId: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { team, title, description, links, files, folderId } = input;

      // const query = await db.eventTeam.update({
      //   where: {
      //     id: team
      //   },
      //   data: {
      //     submission: {
      //       create: {
      //         title,
      //         description,
      //         folderId,
      //         files,
      //         links
      //       }
      //     }
      //   },
      //   include: {
      //     participants: true,
      //     event: true
      //   }
      // });

      // // @ts-ignore
      // console.log(`[${query.event.title.toUpperCase()}] Team ${query.participants.map((p) => p.name).join(", ")} has submitted`)
      // // @ts-ignore
      // console.log(`[${query.event.title.toUpperCase()}] Submission Folder - ${folderId}`)

      // return query;
    }),
  getTeams: publicProcedure
    .input(z.object({
      event: z.enum(['cinematique', 'framesperframe', 'graphique', 'kanvas', 'mindmaze', 'minewars', 'pitchathon', 'radiance', 'reimagine', 'render', 'surprisegaming', 'thebeathive', 'webwaves'])
    }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { event } = input;

      try {
        const res: AxiosResponse<{
          id: string;
          dateAdded: string;
          eventDivisionId: string;
          eventSubCategoryId: string | null;
          eventId: string;
          schoolId: string;
          school: {
            name: string;
            type: "INDIVIDUAL" | "SCHOOL"; // Assuming type can vary
            dateAdded: string;
          };
          students: {
            id: number;
            name: string;
            class: string;
            phone: string;
            discord: string | null;
            eventRegistrationId: string;
          }[];
        }[]> = await axios.get('https://register.thequantumx.xyz/api/scripts/getTeamsByEvents', {
          headers: {
            event
          }
        });

        return res.data;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Unknown Error Occurred while fetching teams!'
        })
      }
    }),
});
