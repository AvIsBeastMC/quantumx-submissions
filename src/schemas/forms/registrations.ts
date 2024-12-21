import { z } from "zod";

const soloRegistrations = z.object({
  // name: z.string().email("Invalid email address").nonempty("Email is required"),
  // password: z.string().min(6, "Password must be at least 6 characters long"),
  name: z.string(),
  phone: z.number(),
  parentContactNumber1: z.number(),
  parentContactNumber2: z.number(),
  event: z.enum([ 
    'pitchathon',
    'web',
    'app',
    'video',
    'music',
    'valorant',
    'minecraft',
    'threeD',
    'music',
    'quiz'
  ]),
});

const teamRegistrations = z.object({
  // name: z.string().email("Invalid email address").nonempty("Email is required"),
  // password: z.string().min(6, "Password must be at least 6 characters long"),
  name: z.string(),
  phone: z.number(),
  parentContactNumber1: z.number(),
  parentContactNumber2: z.number(),
  event: z.enum([ 
    'pitchathon',
    'web',
    'app',
    'valorant',
    'minecraft',
    'quiz'
  ]),
  participants: z.array(z.object({
    name: z.string(),
    parentContactNumber: z.number(),
    class: z.string()
  }))
});

export { soloRegistrations, teamRegistrations }