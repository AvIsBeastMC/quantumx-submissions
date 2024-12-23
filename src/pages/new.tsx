/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Button, cn, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, Textarea, useDisclosure } from '@nextui-org/react'
import React, { useEffect, useRef, useState } from 'react'
import { Inter, ShadowsIntoLight } from './_app'
import { AnimatePresence, motion } from 'framer-motion'
import { api } from '~/utils/api'

import { toast, Toaster } from 'react-hot-toast'
import router from 'next/router'
import Navbar from '~/components/Navbar'

import { LockKeyholeOpen, MoveLeft } from 'lucide-react'
import { size, method } from 'lodash'
import { title } from 'process'
import file from './api/file'

const Submission = () => {
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

  const [mode, setMode] = useState<'event' | 'login' | 'main'>('event');
  const [selectedEvent, setSelectedEvent] = useState<SE>();
  const { mutate: submissionMutation } = api.submissions.submit.useMutation()

  const [selectedEventRegistration, setSelectedEventRegistration] = useState<{
    eventRegistration: string;
    schoolId: string;
    eventSubCategory?: string;
    eventDivision?: string;
  } | null>(null);

  const EventSelection = () => {
    const select = (i: SE) => {
      setSelectedEvent(i);
      setMode('login')
    }

    return (
      <main className="backdrop-blur-sm flex min-h-screen flex-col items-center justify-center main py-12">
        <div className='mx-auto md:w-2/4 px-6'>
          <h1 className='text-3xl font-bold mb-12'><span className='border-b-2 border-dotted'>SELECT YOUR EVENT</span></h1>

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
    )
  };

  const LoginMode = () => {
    type DATATYPE = {
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
    };
    const [data, setData] = useState<DATATYPE[]>()

    const { mutateAsync } = api.submissions.getTeams.useMutation();
    console.log({ data, selectedEvent, selectedEventRegistration })

    console.log("STATE CHANGED")

    useEffect(() => {
      if (data) return;

      if (selectedEvent) void mutateAsync({
        event: selectedEvent
      }, {
        onSuccess(d) {
          setData(d);
        },
        onError(e) {
          toast.error('An Unknown Error Occurred while trying to load teams.')
        }
      });
    }, [data])

    if (!data) return <></>
    // (
    //   <div className='flex mx-auto items-center justify-center mt-12 gap-4 text-xl'><Spinner /> Please wait...</div>
    // );

    const TeamComponent = ({ t }: { t: DATATYPE }) => (
      <div onClick={() => {
        setSelectedEventRegistration({
          eventRegistration: t.id,
          schoolId: t.schoolId,
          eventDivision: t.eventDivision ? t.eventDivision.title : undefined,
          eventSubCategory: t.eventSubCategory ? t.eventSubCategory.title : undefined,
        });
        setMode('main')
        // setModalAuth(t.schoolId);
      }} className='cursor-pointer py-4 border-gray-300 px-6 border-1 rounded-xl hover:scale-[1.03] transition-all'>
        <h2 className='text-sm'>Category: {t.eventDivisionId && t.eventDivision?.title}{t.eventSubCategoryId && ` - ${t.eventSubCategory?.title}`}</h2>
        <h1 className='text-xl font-bold'>{t.schoolId}</h1>
        <span>{t.students.map((s) => s.name).join(', ')}</span>
      </div>
    );

    return (
      <>
        <main className="backdrop-blur-sm flex my-12 flex-col items-center justify-center main">
          <div className='mx-auto w-2/3'>
            <div className='w-2/4'>
              <button onClick={() => {
                setSelectedEvent(undefined);
                setMode('event')
              }} className='mb-2 flex flex-row gap-2 items-center'><MoveLeft /> Go back to Event Selection</button>

              <h1 className='text-3xl font-bold mb-2'><span className='border-b-2 border-dotted'>LOGIN ({categories.find((c) => c.id == selectedEvent)?.name})</span></h1>
              <p className='mb-6'>Check which team you belong to, and submit accordingly!</p>
            </div>

            <h1 className='text-2xl font-bold mb-2'>
              <span className='border-b-2'>Schools</span>
            </h1>
            <div className='flex flex-col gap-2'>
              {data.sort((a, b) => a.schoolId.localeCompare(b.schoolId)).filter((d) => d.school.type == 'SCHOOL').map((t, i) => <TeamComponent key={i} t={t} />)}
            </div>

            <h1 className='mt-6 text-2xl font-bold mb-2'>
              <span className='border-b-2'>Individuals</span>
            </h1>
            <div className='flex flex-col gap-2'>
              {data.sort((a, b) => a.schoolId.localeCompare(b.schoolId)).filter((d) => d.school.type == 'INDIVIDUAL').map((t, i) => <TeamComponent key={i} t={t} />)}
            </div>
            {/* <div className='flex flex-col'>
            <Input value={phone ? phone.toString() : undefined} type="number" onInput={(e) => onInput(e.currentTarget.value)} label="Phone" placeholder="Participant Phone Number" />
          </div>
          {(!loading && (phone?.toString().length == 10)) && (
            <button onClick={load} className='mt-4 border-2 rounded-xl px-5 py-1'>Search Team</button>
          )} */}
          </div>
        </main>
      </>
    )
  }

  const Main = () => {
    const { mutate: authenticateAsync } = api.submissions.authenticate.useMutation();
    const [files, setFiles] = useState<string[]>([]);
    const [folderId, setFolderId] = useState<string>();
    const [uploading, setUploading] = useState<boolean>(false);

    const [isPublishing, setIsPublishing] = useState<boolean>(false);

    const [passwordInput, setPasswordInput] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);

    const [authenticated, setAuthenticated] = useState<boolean>(false);

    // Inputs
    const [title, setTitle] = useState<string>()
    const [description, setDescription] = useState<string>()
    const [links, setLinks] = useState<string[]>([''])

    const fileInput = useRef<HTMLInputElement>(null);

    console.log(selectedEventRegistration);

    if (!selectedEventRegistration) return <></>;

    const authenticate = () => {
      if (!passwordInput) return toast.error('Please enter password properly.')

      setLoading(true);

      authenticateAsync({
        password: passwordInput,
        schoolId: selectedEventRegistration?.schoolId
      }, {
        onSuccess(d) {
          if (d == true) {
            console.log('1', 'authetnicatged')
            console.log('2', selectedEventRegistration);
            setAuthenticated(true)
          } else {
            setLoading(false);
            return toast.error('Bad Password entered! Please try again.')
          }
        }
      })
    }

    const fileUpload = () => {
      if (fileInput) {
        fileInput.current?.click()
      };
    };

    const filesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const eFiles = e.currentTarget?.files ?? []
      const file = eFiles.length ? eFiles[0] : null;

      if (!file) return;

      setUploading(true);

      const allFiles = Array.from(eFiles)

      // upload to server 
      const formData = new FormData()

      allFiles.forEach((file) => {
        formData.append('file', file)
      });

      const toastLoading = toast.loading('Please wait... uploading project files.')

      try {
        const response: { message: string[], uuid: string } = await fetch("/api/file", {
          method: "POST",
          body: formData
        }).then((r) => r.json());

        setFolderId(response.uuid)
        setFiles(response.message);
        setUploading(false)

        toast.success('Successfully uploaded the files! You may proceed to submit your project now.', {
          id: toastLoading
        })
      } catch (error) {
        toast.error('Sorry! An unknown error occurred.', {
          id: toastLoading
        })

        setTimeout(() => {
          router.reload()
        }, 2000);
      }
    };

    const submit = (e: React.FormEvent) => {
      e.preventDefault();

      console.log({ files, title, description, folderId, team: selectedEventRegistration })

      const eventName = categories.find((c) => c.id == selectedEvent)!.name;

      if (!title || !description) return;
      if (!selectedEventRegistration) return;
      if (!eventName) return;

      setIsPublishing(true);

      const toastLoading = toast.loading("Please wait... submitting.");

      submissionMutation({
        title,
        description,
        files,
        folderId,
        links,
        team: selectedEventRegistration.eventRegistration,
        otherData: {
          eventName,
          eventSubCategory: selectedEventRegistration.eventSubCategory,
          eventDivision: selectedEventRegistration.eventSubCategory,
        }
      }, {
        onSuccess(d) {
          toast.success('You have successfully submitted your project! You may leave the website now.', {
            id: toastLoading,
            duration: 4000
          });

          setMode('login')

          setTimeout(() => {
            void router.reload()
          }, 3000);
        },
        onError(e) {
          toast.error('An Error Occurred: ' + e.message, {
            id: toastLoading
          });
        }
      })
    }

    return (
      <>
        {authenticated ? (
          <main className="backdrop-blur-sm flex min-h-screen flex-col items-center justify-center main">
            <form onSubmit={submit} className='mx-auto w-2/4'>
              <button type='button' onClick={() => {
                setSelectedEvent(undefined);
                setMode('event')
              }} className='mb-2 flex flex-row gap-2 items-center'><MoveLeft /> Go back to Event Selection</button>
              <h1 className='text-3xl font-bold mb-2'><span className='border-b-2 border-dotted'>{categories.find((c) => c.id == selectedEvent)?.name.toUpperCase()} PROJECT SUBMISSION</span></h1>
              <p className='mb-6'>You can enter title, description, links and any set of files!</p>

              <div className='flex flex-col gap-3 w-2/3'>
                <Input onValueChange={setTitle} required label="Title" placeholder="Project Title" />
                <Textarea onValueChange={setDescription} label="Description" placeholder="Small Project Description" />
              </div>
              <div className='mt-8 flex flex-col gap-3 w-2/3'>
                <div className='flex flex-col'>
                  <h1 className='font-bold text-xl'>LINKS</h1>
                  <button type='button' onClick={() => setLinks([
                    ...links,
                    ''
                  ])} className='mt-2 border-2 rounded-xl px-5 py-1'>🔗 Add Link</button>

                </div>
                {links.map((l, i) => <Input key={i} label={`Link ${i + 1}`} endContent={
                  <button type='button' onClick={() => {
                    const newLinks = links.filter((l1) => l1 !== l);
                    setLinks(newLinks);
                  }} className="focus:outline-none" aria-label="toggle password visibility">
                    🗑️
                  </button>
                } defaultValue={l} onValueChange={(v) => {
                  const orgLinks = links;
                  const newLinks = orgLinks.map((old, iN) => iN == i ? v : old);

                  setLinks(newLinks)
                }} placeholder="Enter Link" />)}
              </div>
              <div className='mt-8 flex flex-col gap-3 w-2/3'>
                <div className='flex flex-col'>
                  <h1 className='font-bold text-xl'>FILES</h1>
                  <AnimatePresence mode='wait'>
                    {!uploading && <motion.button type='button' key="animate" animate={{
                      opacity: 1
                    }} exit={{
                      opacity: 0
                    }} onClick={fileUpload} className='mt-2 border-2 rounded-xl px-5 py-1'>
                      {(files.length == 0) ? "📂 Add All Files and Supporting Materials" : '✅ Success! You may click to do all the uploads again.'}
                    </motion.button>}
                  </AnimatePresence>
                </div>
                <div className='mt-3'>
                  {!uploading && <Button isLoading={isPublishing} isDisabled={isPublishing} type='submit' radius="md" color='danger'>
                    📄 SUBMIT
                  </Button>}
                </div>
              </div>
            </form>
          </main>
        ) : (

          <Modal className={cn(Inter.className)} isOpen={true} size={"xl"}
            isDismissable={false}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1 border-b-2 mb-2">PASSWORD AUTHENTICATION <br /><span className='text-sm font-light'> for {selectedEventRegistration?.schoolId}</span></ModalHeader>
                  <ModalBody className='text-sm'>
                    <p>
                      You need to enter the <b>6-digit password</b> provided to you via E-mail or Discord, otherwise, you will not be able to submit.
                    </p>
                    <p>If you are unable to find the password - please contact Event Directors on Discord (<a className='text-blue-600 hover:opacity-75 transition-all' target='_blank' href='https://discord.gg/cxYrZ3qx4W'>https://discord.gg/cxYrZ3qx4W</a>) immediately.</p>
                    <Input onValueChange={(v) => setPasswordInput(v)} maxLength={6} label="Password" placeholder="Enter Password" type="text" />
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={() => {
                      setSelectedEventRegistration(null);
                      setMode('login');
                    }}>
                      Close
                    </Button>
                    <Button isLoading={loading} onClick={() => authenticate()} className='font-bold' color="primary" onPress={onClose}>
                      <LockKeyholeOpen />
                      AUTHENTICATE
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        )}
        <input onChange={filesUpload} className="hidden" type="file" multiple ref={fileInput} />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <AnimatePresence mode='wait'>
        <motion.div initial={{
          opacity: 0
        }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          transition={{
            duration: 0.7
          }}
          key={mode}
        >
          {mode == 'event' ? <EventSelection /> : mode == 'login' ? <LoginMode /> : <Main />}
        </motion.div>
      </AnimatePresence>
      <Toaster />
    </>
  )
}

export default Submission