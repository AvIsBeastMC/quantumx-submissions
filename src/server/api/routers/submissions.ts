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

      const query = await db.submission.create({
        data: {
          title,
          description,
          folderId,
          eventRegistrationId: team,
          files,
          links
        },
      });

      // send to API that registration done!
      const req = await axios.get('https://register.thequantumx.xyz/api/scripts/submissionDone', {
        headers: {
          eventregistration: team
        }
      });
      console.log(req.status);

      // // @ts-ignore
      // console.log(`[${query.event.title.toUpperCase()}] Team ${query.participants.map((p) => p.name).join(", ")} has submitted`)
      // // @ts-ignore
      // console.log(`[${query.event.title.toUpperCase()}] Submission Folder - ${folderId}`)

      return query;
    }),
  authenticate: publicProcedure
    .input(z.object({
      schoolId: z.string(),
      password: z.string()
    }))
    .mutation(async ({ input }) => {
      const { schoolId, password } = input;

      try {
        const request: AxiosResponse<{password: string}> = await axios.get('https://register.thequantumx.xyz/api/scripts/authenticate', {
          headers: {
            school: schoolId
          }
        });
        
        if (request.data.password == password) return true
        return false;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: JSON.stringify(error)
        })
      }
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
              dateAdded: Date | null;
              submitted: boolean;
              eventId: string;
              eventSubCategoryId: string | null;
              eventDivisionId: string | null;
              schoolId: string;
              school: {
                name: string;
                type: 'SCHOOL' | 'INDIVIDUAL';
                password: string;
                dateAdded: Date | null;
              };
              eventDivision: {
                id: string;
                title: string;
                subTitle: string | null;
                eventId: string;
              } | null;
              eventSubCategory: {
                id: string;
                title: string;
                eventId: string;
              } | null;
              students: Array<{
                id: number;
                name: string;
                class: string;
                phone: string | null;
                discord: string | null;
                eventRegistrationId: string;
              }>;
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
