/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import { atom, useAtom } from 'jotai';
import { api } from "~/utils/api";
import { cn } from "@nextui-org/react";
import { ShadowsIntoLight } from "~/pages/_app";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, CloudDownload, LinkIcon } from "lucide-react";
import Link from "next/link";

const modeAtom = atom<{
  mode: 'list' | 'data',
  data?: any
}>({
  mode: 'list',
  data: undefined
});

type SE = 'cinematique' | 'framesperframe' | 'kanvas' | 'mindmaze' | 'pitchathon' | 'reimagine' | 'render' | 'thebeathive' | 'webwaves'

const categories: {
  name: string,
  id: SE,
}[] = [{
  id: 'cinematique',
  name: 'Cinematique',
}, {
  id: 'framesperframe',
  name: 'Frames Per Frame'
}, {
  id: 'kanvas',
  name: 'Kanvas'
}, {
  id: 'mindmaze',
  name: 'Mindmaze'
}, {
  id: 'pitchathon',
  name: 'Pitchathon'
}, {
  id: 'reimagine',
  name: 'Re-Imagine',
}, {
  id: 'render',
  name: 'Render'
}, {
  id: 'thebeathive',
  name: 'The Beat Hive'
}, {
  id: 'webwaves',
  name: 'Web Waves'
}]

const List = () => {
  const [mode, setMode] = useAtom(modeAtom);

  const select = (s: SE) => {
    setMode({
      mode: 'data',
      data: categories.find((c) => c.id == s)!.name
    })
  }

  return (
    <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <main className="backdrop-blur-sm flex min-h-screen flex-col items-center justify-center main py-12">
        <div className='mx-auto md:w-2/4 px-6'>
          <h1 className='text-3xl font-bold mb-12'><span className='border-b-2 border-dotted'>SELECT EVENT</span></h1>

          <div className='flex flex-col'>
            {categories.map((c, i) => (
              <button onClick={() => select(c.id)} key={i} className='flex flex-row gap-4 items-center hover:scale-105 transition-all'>
                ○
                <div className='border-b-2 border-dotted w-full py-6 self-left align-left'>
                  <h1 className={cn('text-4xl font-bold tracking-widest text-left', ShadowsIntoLight.className)}>{c.name}</h1>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </motion.div>
  )
}

const Data = () => {
  const [mode, setMode] = useAtom(modeAtom);
  const { data, error } = api.admin.list.useQuery(typeof mode.data == 'string' ? mode.data : '');

  if (!data) return <></>;

  const submissions = {
    individual: data.filter(d => d.moreData?.school.type == 'INDIVIDUAL'),
    school: data.filter(d => d.moreData?.school.type == 'SCHOOL'),
    unidentified: data.filter(d => !d.moreData),
  };

  const Submission = ({ s }: { s: typeof data[number] }) => {
    return (
      <div className="rounded-xl border-2 border-gray-100 px-4 py-2 w-full flex flex-col">
        <div className="mr-auto">
          <span className="font-medium">
            {s.moreData?.eventSubCategory ? `${s.moreData.eventSubCategory.title} ${s.moreData?.eventDivision && ", "}` : ""}{s.moreData?.eventDivision?.title && `${s.moreData?.eventDivision?.title}`}</span>
          <h1 className="text-xl font-bold">{s.moreData?.schoolId ?? <span className="text-red-300">⚠️ Registration Not Found</span>}</h1>
          <div className="flex flex-col mt-1">
            <span><span className="font-medium">Project title:</span> {s.title}</span>
            <span><span className="font-medium">Submitted by:</span> {s.moreData?.students.map((s) => s.name).join(', ')}</span>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-2 items-center">
          {s.files.map((f, i) => <Link target="_blank" href={`https://static-files.thequantumx.xyz/submissions/${s.folderId}/${f}`} key={i} className="hover:bg-gray-100 transition-colors flex flex-row gap-1 px-2 py-1 rounded-md border-1 border-gray-200 items-center gap-2"><CloudDownload size={16} /> File</Link>)}
          {s.links.map((l, i) => <Link target="_blank" href={l} key={i} className="hover:bg-gray-100 transition-colors flex flex-row gap-1 px-2 py-1 rounded-md border-1 border-gray-200 items-center gap-2"><LinkIcon size={16} /> Link</Link>)}
        </div>
      </div>
    )
  }

  return (
    <motion.div className="w-full" key="data" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="w-2/3 flex flex-col mx-auto py-12">
        <button onClick={() => {
          setMode({
            mode: 'list',
            data: undefined
          })
        }} className="flex flex-row gap-2 items-center mb-2"><ArrowLeft size={16} /> GO BACK</button>
        <h1 className="font-bold text-4xl">
          <span className="border-b-2 border-gray-200">{mode.data}</span>
        </h1>
        <p className="mt-3"><b>SUBMISSIONS:</b> {submissions.individual.length} Individual, {submissions.school.length} School</p>

        <div className="w-full py-6">
          <h1 className="font-medium text-2xl mb-2">
            <span className="border-b-2 border-dotted border-gray-200">Individual</span>
          </h1>
          <div className="w-full md:w-3/4 py-2 flex flex-col gap-2">
            {submissions.individual.map((s, i) => (
              <Submission s={s} key={i} />
            ))}
          </div>
        </div>
        <div className="w-full py-3">
          <h1 className="font-medium text-2xl mb-2">
            <span className="border-b-2 border-dotted border-gray-200">School</span>
          </h1>
          <div className="w-full md:w-3/4 py-2 flex flex-col gap-2">
            {submissions.school.map((s, i) => (
              <Submission s={s} key={i} />
            ))}
          </div>
        </div>
        {(submissions.unidentified.length > 0) && (
          <div className="w-full py-3">
            <h1 className="font-medium text-2xl mb-2">
              <span className="border-b-2 border-dotted border-gray-200">⚠️ Unidentified</span>
            </h1>
            <div className="w-full md:w-3/4 py-2 flex flex-col gap-2">
              {submissions.unidentified.map((s, i) => (
                <Submission s={s} key={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function MainMode() {
  const [mode, setMode] = useAtom(modeAtom);

  return (
    <AnimatePresence mode="wait">
      {mode.mode == 'list' ? <List /> : <Data />}
    </AnimatePresence>
  )
}